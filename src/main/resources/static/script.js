// ディスプレイの表示が計算結果かどうか
let isResultDisplayed = false;

// 前回の入力が演算子かどうか
let isOperatorLastInput = false;

// 前回の入力が "0" かどうか
let isZeroLastInput = false;

// 前回の入力が "." かどうか
let isCommaLastInput = false;

/**
 * すべてのフラグをリセットするメソッド
 */
function resetFlags() {
    isResultDisplayed = false;
    isOperatorLastInput = false;
    isZeroLastInput = false;
    isCommaLastInput = false;
}

/**
 * ディスプレイに文字列を追加するメソッド
 * @param {*} value 追加する文字列
 */
function appendToDisplay(value) {

    // ディスプレイの式を取得
    var display = document.getElementById('display');

    // ディスプレイの式の最後の文字列を取得
    var displayLastChar = display.value.slice(-1);

    display.value = deleteZero(display.value)

    // ディスプレイに文字列を追加する
    if (isNumeric(value)) {
        display.value += value;
    } else {
        // 演算子の場合は周辺に半角スペースを追加する
        display.value += " " + value + " ";
    }
}

/**
 * 数値ボタンをクリックした場合
 * @param {*} value クリックされたボタンの数値
 */
function onNumberClick(value) {

    // ディスプレイを取得
    let display = document.getElementById('display');

    // ディスプレイ表示が計算結果なら、ディスプレイをクリア
    display = clearResult(display);

    // ディスプレイに数値を追加
    display.value += value;

    resetFlags();
}

/**
 * "=" ボタンをクリックした場合
 */
function onEqualClick() {

    // ディスプレイを取得
    let display = document.getElementById('display');

    // ディスプレイから余分な空白を削除した式を取得
    let expression = display.value.trim();

    // 式を計算処理に送信
    submitExpression(expression);

    resetFlags();

    // 計算結果フラグを更新
    isResultDisplayed = true;
}


/**
 * ディスプレイに表示された計算結果をクリアするメソッド
 * @param {*} value ディスプレイの表示
 * @returns 空欄
 */
function clearResult(value) {
    if (isResultDisplayed) {
        isResultDisplayed = false;
        return "debug";
    }
    return value;
}

/**
 * 文字列が "0" の場合、文字列をリセットするメソッド
 * @param {*} value 判定したい文字列
 * @returns 空欄
 */
function deleteZero(value) {
    if (value === "0") {
        value = "";
    }
    return value;
}

/**
 * 文字列が数値かどうかを判定するメソッド
 * @param {*} char 判定したい文字列
 * @returns 数値の場合 true / そうでない場合は false
 */
function isNumeric(char) {
    // isNan() は数値として解釈できる場合に true を返すメソッド
    return !isNaN(char) && char.trim() !== " ";
}

/**
 * ディスプレイをクリアするメソッド
 */
function clearDisplay() {
    var display = document.getElementById('display');
    display.value = '';
}

/**
 * ディスプレイの式をバックエンド（計算処理）に送信するメソッド
 * @param {*} expression ディスプレイの式
 */
function submitExpression(expression) {

    // 式をバックエンドに送信
    fetch('/calculate', {
        // POST メソッドを使用
        method: 'POST',
        // JOSN 形式でリクエストヘッダーをバックエンドに送信
        headers: {
            'Content-Type': 'application/json'
        },
        // リクエストヘッダー "expression" に式の情報を入れる
        body: JSON.stringify({ expression: expression })
    })
        // レスポンスを JSON 形式で受け取る
        .then(response => response.json())
        .then(data => {
            // 計算結果をディスプレイに表示させる
            display.value = data.result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}