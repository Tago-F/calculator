package com.example.demo.service;

import java.util.Stack;

import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    /** 足し算の記号 */
    private static final String ADD = "+";
    /** 引き算の記号 */
    private static final String SUBTRACT = "-";
    /** 掛け算の記号 */
    private static final String MULTIPLY = "*";
    /** 割り算の記号 */
    private static final String DIVIDE = "/";
    /** ゼロ除算禁止のメッセージ */
    private static final String DIVISION_BY_ZERO_MESSAGE = "ゼロ除算はできません。";
    /** 計算時エラーのメッセージ */
    private static final String ERROR_MESSAGE = "計算実行時にエラーが発生しました。";

    /**
     * 式を評価するメソッド（数値と演算子を分割しスタックに格納する。）。
     *
     * @param expression 評価する計算式。
     * @return 計算結果。
     * @throws IllegalArgumentException 無効な演算子やゼロ除算が発生した場合。
     */
    public double evaluateExpression(String expression) {

        // 空白スペースを目印に、分割した要素を配列に格納。
        String[] tokens = expression.split(" ");

        // 数値を格納する Stack。
        Stack<Double> values = new Stack<>();

        // 演算子を格納する Stack。
        Stack<String> operators = new Stack<>();

        // 配列の要素をそれぞれの Stack へ振るい分け。
        for (String token : tokens) {

            // 要素が数値の場合。
            if (isNumeric(token)) {

                // Double 型に変換しスタックに格納。
                values.push(Double.parseDouble(token));

                // 要素が演算子の場合。
            } else if (isOperator(token)) {

                // 演算子の優先度が、前回 push した演算子よりも高い場合。
                while (!operators.isEmpty() && hasPrecedence(token, operators.peek())) {

                    // スタック values の 1番目 と 2番目 の数値を pop。
                    // それらを優先度の高い演算子で計算し、再度スタック values へ push。
                    values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
                }

                // 演算子をスタック operators へ push。
                operators.push(token);
            }
        }

        // 残った足し算・引き算を計算。
        while (!operators.isEmpty()) {

            // 計算しスタック values へ push。
            values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
        }

        // 計算結果を return。
        return values.pop();
    }

    /**
     * トークンが数値かどうかを判定。
     *
     * @param token 判定するトークン。
     * @return 数値であれば true、そうでなければ false。
     */
    private boolean isNumeric(String token) {
        try {
            Double.parseDouble(token);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * トークンが演算子かどうかを判定
     *
     * @param token 判定するトークン。
     * @return 演算子であれば true、そうでなければ false。
     */
    private boolean isOperator(String token) {
        return token.equals(ADD) || token.equals(SUBTRACT) || token.equals(MULTIPLY) || token.equals(DIVIDE);
    }

    /**
     * 演算子の優先順位を判定。
     *
     * @param operator1 比較する演算子 1。
     * @param operator2 比較する演算子 2。
     * @return operator1 の優先順位が低ければ true、そうでなければ false。
     */
    private boolean hasPrecedence(String operator1, String operator2) {
        if ((operator1.equals(MULTIPLY) || operator1.equals(DIVIDE))
                && (operator2.equals(ADD) || operator2.equals(SUBTRACT))) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 演算子を適用して計算を実施。
     *
     * @param operator 適用する演算子。
     * @param operand2 オペランド 2。
     * @param operand1 オペランド 1。
     * @return 計算結果。
     * @throws IllegalArgumentException 無効な演算子やゼロ除算が発生した場合。
     */
    private double applyOperator(String operator, double operand1, double operand2) {
        switch (operator) {
            case ADD:
                return operand2 + operand1;
            case SUBTRACT:
                return operand2 - operand1;
            case MULTIPLY:
                return operand2 * operand1;
            case DIVIDE:

                // ゼロ除算を許容しない。
                if (operand1 == 0) {
                    throw new ArithmeticException(DIVISION_BY_ZERO_MESSAGE);
                }
                return operand2 / operand1;
            default:

                // その他エラー発生時
                throw new IllegalArgumentException(ERROR_MESSAGE);
        }
    }

    /**
     * 数値が整数の場合 int 型に変換するメソッド。
     * 
     * @param num 変換したい double 型の数値。
     * @return 変換された数値。
     */
    public Number convertIfWholeNumber(double num) {

        // 1 で割った数の余りが 0 の場合（整数の場合）
        if (num % 1 == 0) {
            return (int) num;
        }

        // 小数点以下に数値が含まれる場合
        return num;
    }


}