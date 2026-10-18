package com.brucebility.rulit.service.impl;

import com.brucebility.rulit.mapper.DeptMapper;
import com.brucebility.rulit.pojo.Dept;
import com.brucebility.rulit.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class DeptServiceImpl implements DeptService {

    @Autowired
    private DeptMapper deptMapper;

    //查询所有部门信息
    @Override
    public List<Dept> findAll() {
        return deptMapper.findAll();
    }

    //根据id删除部门信息
    @Override
    public void deleteById(Integer id) {
        deptMapper.deleteById(id);
    }

    //添加部门信息
    @Override
    public void save(Dept dept) {
        //补全基础属性
        dept.setCreateTime(LocalDateTime.now());
        dept.setUpdateTime(LocalDateTime.now());
        //添加部门信息
        deptMapper.insert(dept);
    }

    //根据id查询部门信息
    @Override
    public Dept getById(Integer id) {
        return deptMapper.getById(id);
    }

    //修改部门信息
    @Override
    public void update(Dept dept) {
        //补充基础属性
        dept.setUpdateTime(LocalDateTime.now());
        deptMapper.update(dept);
    }
}
