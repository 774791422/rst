package org.taiji.util;
public class UnitUtils {
    /**
     * java转换数字以万为单位
     * @param num 要转化的数字
     * @param digit 保留的位数 可传null
     * @return
     */
    public static   String conversion(Long num, Integer digit) {
        String unit = "条";
        double newNum=0.0;
        if (num >= 100000000) {
            newNum = num / 100000000.0;
            unit= "亿";
        }
        if (num >= 10000&&num<100000000) {
            newNum = num / 10000.0;
            unit= "万";
        }
        if (num >= 0 && num < 10000) {
            newNum = num;
            unit = "条";
        }

        if(digit != null){
            String numStr = String.format("%." +digit +"f", newNum);
            return numStr + unit;
        }
        return newNum + unit;
    }
}
