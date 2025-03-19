/**
 * ディスプレイに文字列を追加するメソッド
 * @param {*} value 追加する文字列
 */
function appendToDisplay(value) {

    // ディスプレイの式を取得
    var display = document.getElementById('display');

    // ディスプレイの式の最後の文字列を取得
    var displayLastChar = display.value.slice(-1);

    // ディスプレイが初期状態の 0 なら、0 を削除する
    if (display.value === "0") {
        display.value = "";
    }

    // ディスプレイに文字列を追加する
    if (isNumeric(value)) {
        display.value += value;
    } else {
        // 演算子の場合は周辺に半角スペースを追加する
        display.value += " " + value + " ";
    }
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
 * ディスプレイの式をバックエンドに送信するメソッド
 */
function submitExpression() {
    // HTML の display を取得
    var display = document.getElementById('display');
    // display から式を取得
    var expression = display.value;
    // 文字列の最後の余分な半角スペースを削除
    expression = expression.trim();

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
            // バックエンドからの計算結果をディスプレイに表示
            display.value = data.result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}