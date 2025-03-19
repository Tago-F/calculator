package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.service.CalculatorService;

@Controller
public class CalculatorController {

    private final CalculatorService calculatorService;

    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }
    // private CalculatorService calculatorService;

    @GetMapping("/")
    public String calculator() {
        return "calculator";
    }

    @PostMapping("/calculate")
    @ResponseBody
    public Map<String, Object> calculate(@RequestBody Map<String, String> request) {

        // リクエストボディの "expression" の要素を取得
        String expression = request.get("expression");

        // 計算結果の数値を取得
        Double resultDoubleNum = calculatorService.evaluateExpression(expression);

        // 計算結果が整数であれば、余分な小数点を削除
        Number resultNum = calculatorService.convertIfWholeNumber(resultDoubleNum);

        // 計算を実行し、結果を文字列として取得
        String result = resultNum.toString();

        // レスポンスボディ用の Map を準備
        Map<String, Object> response = new HashMap<>();

        // レスポンスボディの "result" に計算結果をセット
        response.put("result", result);

        return response;
    }

}
