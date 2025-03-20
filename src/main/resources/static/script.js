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
 * 数値ボタンをクリックした場合
 * @param {*} value クリックされたボタンの数値
 */
function onNumberClick(value) {

    // ディスプレイを取得
    let display = document.getElementById('display');

    // ディスプレイ表示が計算結果なら、ディスプレイをクリア
    display.value = clearResult(display.value);

    // ディスプレイの最初の文字が 0 なら、ディスプレイをクリア
    display.value = removeBeginningZero(display.value);

    // ディスプレイに数値を追加
    display.value += value;

    resetFlags();
}

function onZeroClick(value) {

    let display = document.getElementById('display');

    if (display.value === "0") {
        display.value = 0;
    } else {
        display.value += value;
    }

    resetFlags();

    isZeroLastInput = true;
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
 * 演算子ボタンをクリックした場合
 * @param {*} value クリックされたボタンの演算子
 */
function onOperatorClick(value) {

    // ディスプレイを取得
    let display = document.getElementById('display');

    // 演算子フラグが true の場合
    if (isOperatorLastInput) {

        // ディスプレイから余分な後ろ3文字を削除
        display.value = display.value.slice(0, -3);

        // 演算子を追加
        display.value += " " + value + " ";

    } else {
        // 演算子を追加
        display.value += " " + value + " ";
    }

    resetFlags();

    isOperatorLastInput = true;
}

/**
 * "." ボタンをクリックした場合
 * @param {*} value クリックされたボタンの文字列
 */
function onCommaClick(value) {

    let display = document.getElementById('display');

    if (!isCommaLastInput) {
        display.value += value;
    }

    resetFlags();

    isCommaLastInput = true;
}

function onClearClick() {

    let display = document.getElementById('display');

    display.value = "";

    resetFlags();
}

/**
 * 1 文字目が 0 の場合、式をリセット
 * @param {*} value 判定したい式
 * @returns 空欄
 */
function removeBeginningZero(value) {
    if (value.slice(0, 1) === "0") {
        return "";
    }
    return value;
}


/**
 * ディスプレイに表示された計算結果をクリア
 * @param {*} value ディスプレイの表示
 * @returns 空欄
 */
function clearResult(value) {
    if (isResultDisplayed) {
        isResultDisplayed = false;
        return "";
    }
    return value;
}

/**
 * ディスプレイの式をバックエンド（計算処理）に送信
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