package com.itheima.controller;

import com.itheima.pojo.Emp;
import com.itheima.pojo.EmpQueryParam;
import com.itheima.pojo.PageResult;
import com.itheima.pojo.Result;
import com.itheima.service.EmpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RequestMapping("/emps")
@RestController
public class EmpController {
    @Autowired
    private EmpService empService;

    //添加员工信息
    @PostMapping
    public Result save(@RequestBody Emp emp) {
        log.info("添加员工信息: {}", emp);
        empService.save(emp);
        return Result.success();
    }


    // 分页查询员工信息
    @GetMapping
    public Result page(EmpQueryParam empQueryParam) {
        log.info("查询员工信息: {}", empQueryParam);
        PageResult pageResult = empService.page(empQueryParam);
        return Result.success(pageResult);
    }

//    @GetMapping
//    public Result page(@RequestParam(defaultValue = "1") Integer page,
//                       @RequestParam(defaultValue = "10") Integer pageSize,
//                       String name, Integer gender,
//                       @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate begin,
//                       @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end) {
//        log.info("查询员工信息 page={}, pageSize={}", page, pageSize, name, gender, begin, end);
//        PageResult pageResult = empService.page();
//        return Result.success(pageResult);
//    }
}
