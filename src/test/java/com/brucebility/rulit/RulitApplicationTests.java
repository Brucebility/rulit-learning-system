package com.brucebility.rulit;

import com.brucebility.rulit.mapper.EmpMapper;
import com.brucebility.rulit.pojo.Emp;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class RulitApplicationTests {
    @Autowired
    private EmpMapper empMapper;

//    @Test
//    void contextLoads() {
//    }

//    @Test
//    public void testList() {
//        List<Emp> emps = empMapper.list();
//        emps.forEach(System.out::println);
//    }


}
