package com.github.rayinfinite.scheduler.service;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.read.metadata.ReadSheet;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.github.rayinfinite.scheduler.entity.*;
import com.github.rayinfinite.scheduler.excel.BaseExcelReader;
import com.github.rayinfinite.scheduler.repository.CourseRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppService {
    private final CourseRepository courseRepository;
    private final ClassroomService classroomService;
    private final GAService gaService;
    private final Lock lock = new ReentrantLock();
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    public String upload(MultipartFile file) throws IOException {
        lock.lock();
        log.info("Uploading file: {}", file.getOriginalFilename());
        BaseExcelReader<Course> courseReader = new BaseExcelReader<>();
        BaseExcelReader<Cohort> cohortReader = new BaseExcelReader<>();
        BaseExcelReader<Timeslot> timeReader = new BaseExcelReader<>();
        try (ExcelReader excelReader = EasyExcel.read(file.getInputStream()).build()) {
            ReadSheet courseSheet =
                    EasyExcel.readSheet(0).head(Course.class).registerReadListener(courseReader).build();
            ReadSheet cohortSheet =
                    EasyExcel.readSheet(1).head(Cohort.class).registerReadListener(cohortReader).build();
            ReadSheet timeSheet = EasyExcel.readSheet(2).head(Timeslot.class).registerReadListener(timeReader).build();
            excelReader.read(courseSheet, cohortSheet, timeSheet);
        }
        lock.unlock();

        Thread.ofVirtual().start(() -> gap(courseReader.getDataList(), cohortReader.getDataList(),
                timeReader.getDataList()));
        return "success";
    }

    public String detectionUpload(MultipartFile file) throws IOException {
        lock.lock();
        log.info("Uploading file: {}", file.getOriginalFilename());

        BaseExcelReader<OutputData> outputDataReader = new BaseExcelReader<>();
        BaseExcelReader<Registration> registrationReader = new BaseExcelReader<>();

        try (ExcelReader excelReader = EasyExcel.read(file.getInputStream()).build()) {
            ReadSheet outputDataSheet =
                    EasyExcel.readSheet(0).head(OutputData.class).registerReadListener(outputDataReader).build();
            ReadSheet registrationSheet =
                    EasyExcel.readSheet(3).head(Registration.class).registerReadListener(registrationReader).build();

            excelReader.read(outputDataSheet, registrationSheet);
        }
        gaService.updateRegistrations(registrationReader.getDataList());
        lock.unlock();

        Thread.ofVirtual().start(() -> detection(outputDataReader.getDataList()));
        return "success";
    }


    public void detection(List<OutputData> dataList) {
        var result = gaService.detection(dataList, classroomService.getAllClassrooms());
        List<Course> courseList = new ArrayList<>();
        int i = 1;
        for(OutputData output : result) {
            Course course = new Course();
            course.setId(i++);
            course.setPracticeArea(output.getPracticeArea());
            course.setCourseName(output.getCourseName());
            course.setCourseCode(output.getCourseCode());
            course.setDuration(output.getDuration());
            course.setSoftware(output.getSoftware());
            course.setCohort(output.getCohort());
            course.setRun(output.getRun());
            course.setCourseDate(output.getCourseDate());
            course.setWeek(output.getWeek());
            course.setClassroom(output.getClassroom());
            course.setTeacher1(output.getTeacher1());
            course.setTeacher2(output.getTeacher2());
            course.setTeacher3(output.getTeacher3());
            course.setManager(output.getManager());
            course.setCert(output.getCert());
            courseList.add(course);
        }
        courseRepository.deleteAll();
        courseRepository.saveAll(courseList);
        log.info("{} Data saved to database", courseList.size());
    }

    public void gap(List<Course> courseList, List<Cohort> cohortList, List<Timeslot> timeslotList) {
        var result = gaService.gap(courseList, cohortList, timeslotList, classroomService.getAllClassrooms());
        courseRepository.deleteAll();
        courseRepository.saveAll(result);
        log.info("{} Data saved to database", result.size());
    }

    public void downloadExcel(HttpServletResponse response) throws IOException {
        String fileName = "Course";
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");

        List<Course> courseList = courseRepository.findAll();
        List<OutputData> outputDataList = new ArrayList<>();
        for(Course course : courseList) {
            OutputData output = new OutputData();
            BeanUtils.copyProperties(course, output);
            outputDataList.add(output);
        }

        List<ClashData> clashInfos = gaService.getClashes();
        List<RoomUtilization> roomUtilizations = gaService.getRoomUtilizations();
        List<Registration> registrations = gaService.getRegistrations();

        ExcelWriter excelWriter = EasyExcel.write(response.getOutputStream()).build();

        // 写入第一个 Sheet - 课程信息
        WriteSheet courseSheet = EasyExcel.writerSheet(0, "Course").head(OutputData.class).build();
        excelWriter.write(outputDataList, courseSheet);

        // 写入第二个 Sheet - 冲突报告
        WriteSheet clashSheet = EasyExcel.writerSheet(1, "Clash").head(ClashData.class).build();
        excelWriter.write(clashInfos, clashSheet);

        // 写入第三个 Sheet - 教室利用率
        WriteSheet roomUtilizationSheet = EasyExcel.writerSheet(2, "Utilization").head(RoomUtilization.class).build();
        excelWriter.write(roomUtilizations, roomUtilizationSheet);

        // 写入第四个 Sheet - 注册
        WriteSheet registrationSheet = EasyExcel.writerSheet(3, "Registration").head(Registration.class).build();
        excelWriter.write(registrations, registrationSheet);

        // 关闭 ExcelWriter
        excelWriter.finish();
    }


    public List<Course> findByCourseDateBetween(String startDate, String endDate, List<String> teachers, List<String> cohorts) throws ParseException {
        Date start = formatter.parse(startDate);
        Date end = formatter.parse(endDate);
        List<Course> data = courseRepository.findByCourseDateBetween(start, end);
        if (teachers != null && !teachers.isEmpty()) {
            data.removeIf(inputData -> !teachers.contains(inputData.getTeacher1())
                    && !teachers.contains(inputData.getTeacher2())
                    && !teachers.contains(inputData.getTeacher3()));
        }
        if(cohorts != null && !cohorts.isEmpty()) {
            data.removeIf(inputData -> !cohorts.contains(inputData.getCohort()));
        }
        return data;
    }

    public List<String> getAllTeachers() {
        List<String> list = new ArrayList<>();
        list.addAll(courseRepository.findTeacher1());
        list.addAll(courseRepository.findTeacher2());
        list.addAll(courseRepository.findTeacher3());
        return list.stream().filter(Objects::nonNull).filter(s -> !s.isEmpty())
                .distinct().sorted().toList();
    }

    public List<String> getAllCohorts() {
        return courseRepository.findCohort();
    }
}
