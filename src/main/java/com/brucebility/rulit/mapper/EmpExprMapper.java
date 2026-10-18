package com.brucebility.rulit.mapper;

import com.brucebility.rulit.pojo.EmpExpr;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmpExprMapper {

    //批量添加员工工作经历
    void insertBatch(List<EmpExpr> exprList);
}
