package com.brucebility.rulit.service;

import com.brucebility.rulit.pojo.Emp;
import com.brucebility.rulit.pojo.EmpQueryParam;
import com.brucebility.rulit.pojo.PageResult;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public interface EmpService {
    //    PageResult page(Integer page, Integer pageSize, String name, Integer gender, LocalDate begin, LocalDate end);
    // 分页查询员工数据
    PageResult page(EmpQueryParam empQueryParam);

    // 保存员工
    void save(Emp emp);
}
