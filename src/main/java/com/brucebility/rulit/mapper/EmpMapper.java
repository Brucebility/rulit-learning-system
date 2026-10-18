package com.brucebility.rulit.mapper;

import com.brucebility.rulit.pojo.Emp;
import com.brucebility.rulit.pojo.EmpExpr;
import com.brucebility.rulit.pojo.EmpQueryParam;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface EmpMapper {
    //查询所有员工以及部门名称
    List<Emp> list(EmpQueryParam empQueryParam);

    //添加员工
    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into emp(username, name, gender, phone, job, salary, image, entry_date, dept_id, create_time, update_time) " +
            "values (#{username},#{name},#{gender},#{phone},#{job},#{salary},#{image},#{entryDate},#{deptId},#{createTime},#{updateTime})")
    void insert(Emp emp);


//    @Select("select e.*,d.name as deptName from emp e left join dept d on e.dept_id = d.id ")
//    public List<Emp> list();

    //初始方法
  /*  //查询总条数
    @Select("select count(*) from emp e left join dept d on e.dept_id = d.id")
    Long count();

    // 查询所有员工以及部门名称
    @Select("select e.*,d.name as deptName from emp e left join dept d on e.dept_id = d.id limit #{start},#{pageSize} ")
    List<Emp> list(Integer start, Integer pageSize);*/

    //PageHelper
    //查询所有员工以及部门名称
//    @Select("select e.*,d.name as deptName from emp e left join dept d on e.dept_id = d.id ")
//    List<Emp> list();

//    List<Emp> list(String name, Integer gender, LocalDate begin, LocalDate end);
}
