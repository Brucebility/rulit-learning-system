package com.brucebility.rulit.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.brucebility.rulit.mapper.EmpExprMapper;
import com.brucebility.rulit.mapper.EmpMapper;
import com.brucebility.rulit.pojo.Emp;
import com.brucebility.rulit.pojo.EmpExpr;
import com.brucebility.rulit.pojo.EmpQueryParam;
import com.brucebility.rulit.pojo.PageResult;
import com.brucebility.rulit.service.EmpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmpServiceImpl implements EmpService {
    @Autowired
    private EmpMapper empMapper;

    @Autowired
    private EmpExprMapper empExprMapper;

    //添加员工
    @Transactional
    @Override
    public void save(Emp emp) {
        //1.补全基础属性
        emp.setCreateTime(LocalDateTime.now());
        emp.setUpdateTime(LocalDateTime.now());
        //2.添加员工信息
        empMapper.insert(emp);
        //3.保存员工的工作经历
        Integer empId = emp.getId();
        List<EmpExpr> exprList = emp.getExprList();
        if (!CollectionUtils.isEmpty(exprList)) {
            exprList.forEach(empExpr -> empExpr.setEmpId(empId));
            empExprMapper.insertBatch(exprList);
        }

    }

    //分页查询员工
    @Override
    public PageResult page(EmpQueryParam empQueryParam) {
        //1.设置分页参数
        PageHelper.startPage(empQueryParam.getPage(), empQueryParam.getPageSize());
        //2.执行查询
        List<Emp> empList = empMapper.list(empQueryParam);
        Page<Emp> p = (Page<Emp>) empList;
        //3.封装结果
        return new PageResult(p.getTotal(), p.getResult());
    }



   /* @Override
    public PageResult page(Integer page, Integer pageSize, String name, Integer gender, LocalDate begin, LocalDate end) {
        //1.设置分页参数
        PageHelper.startPage(page, pageSize);
        //2.执行查询
        List<Emp> empList = empMapper.list(name, gender, begin, end);
        Page<Emp> p = (Page<Emp>) empList;
        //3.封装结果
        return new PageResult(p.getTotal(), p.getResult());
    }*/



   /* @Override
    public PageResult page(Integer page, Integer pageSize) {
        //1.获取总记录数
        Long total = empMapper.count();

        //2.获取结果列表
        Integer start = (page - 1) * pageSize;
        List<Emp> empList = empMapper.list(start, pageSize);

        //3.封装结果
        return new PageResult(total, empList);

    }*/
}
