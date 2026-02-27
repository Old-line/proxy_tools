/*
 * AI解锁查询
 * 感谢并修改自 https://github.com/BOBOLAOSHIV587/Rules/blob/4cedd99b3af95c00d17059b9a3c7baca10b01184/Loon/NodeTools/JS/NodeUnlockDetection.js
 * 脚本功能：检查节点是否支持ChatGPT/Gemini解锁服务
 * 2025.6.7  修复ChatGPT检测（禁用308重定向） by dcpengx
 */

// --- 配置部分 ---
const GPT_BASE_URL = 'https://chat.openai.com/'
const GPT_RegionL_URL = 'https://chat.openai.com/cdn-cgi/trace'
const GEMINI_BASE_URL = 'https://gemini.google.com/app'
const GEMINI_REGIONS_URL = 'https://alkalicognitoretrieval-pa.googleapis.com/v1/oneandonly:getRegions'

var inputParams = $environment.params;
var nodeName = inputParams.node;

let flags = new Map([[ "AC" , "🇦🇨" ] ,["AE","🇦🇪"], [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , ["BA", "🇧🇦"], [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫 " ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] ,["HU","🇭🇺"], [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "LU" , "🇱🇺" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "  🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ] , [ "ZA" , "🇿🇦"]])

let result = {
    "title": '  AI 解锁查询',
    "ChatGPT": "<b>ChatGPT: </b>检测失败 ❗️",
    "Gemini": "<b>Gemini: </b>检测失败 ❗️"
}

let arrow = " ➟ "

// ChatGPT 支持列表
const support_countryCodes = ["T1","XX","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BD","BB","BE","BZ","BJ","BT","BA","BW","BR","BG","BF","CV","CA","CL","CO","KM","CR","HR","CY","DK","DJ","DM","DO","EC","SV","EE","FJ","FI","FR","GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HU","IS","IN","ID","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KW","KG","LV","LB","LS","LR","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR","MU","MX","MC","MN","ME","MA","MZ","MM","NA","NR","NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PA","PG","PE","PH","PL","PT","QA","RO","RW","KN","LC","VC","WS","SM","ST","SN","RS","SC","SL","SG","SK","SI","SB","ZA","ES","LK","SR","SE","CH","TH","TG","TO","TT","TN","TR","TV","UG","AE","US","UY","VU","ZM","BO","BN","CG","CZ","VA","FM","MD","PS","KR","TW","TZ","TL","GB"]

// --- 执行主程序 ---
Promise.all([gptTest(), geminiTest()]).then(value => {
    let content = "------------------------------------</br>"+([result["ChatGPT"], result["Gemini"]]).join("</br></br>")
    content = content + "</br>------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>节点</b> ➟ " + nodeName+ "</font>"
    content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
    $done({"title":result["title"],"htmlMessage":content})
})

// --- ChatGPT 检测 (原封不动保留核心逻辑) ---
function gptTest() {
    return new Promise((resolve) => {
        let params = {
            url: GPT_BASE_URL,
            node: nodeName,
            timeout: 5000,
            'auto-redirect': false,
        }
        $httpClient.get(params, (errormsg, response, data) => {
            if (errormsg) {
                result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫"
                return resolve()
            } 
            let resp = JSON.stringify(response)
            let jdg = resp.indexOf("text/plain")
            if (jdg == -1) {
                $httpClient.get({url: GPT_RegionL_URL, node: nodeName, timeout: 5000}, (emsg, resheader, resData) => {
                    if (emsg) {
                        result["ChatGPT"] = "<b>ChatGPT: </b>检测失败 ❗️";
                        return resolve();
                    }
                    let region = resData.split("loc=")[1].split("\n")[0]
                    let res = support_countryCodes.indexOf(region)
                    if (res != -1) {
                        result["ChatGPT"] = "<b>ChatGPT: </b>支持 " + arrow + "⟦" + flags.get(region.toUpperCase()) + "⟧ 🎉"
                    } else {
                        result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫"
                    }
                    resolve()
                })
            } else {
                result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫"
                resolve()
            }
        })
    })
}

// --- Gemini 检测 
function geminiTest() {
    return new Promise((resolve) => {
        let params = {
            url: GEMINI_BASE_URL,
            node: nodeName,
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' }
        }
        $httpClient.get(params, (err, response, data) => {
            // 1. 初步检查：如果有错误或明确的 403，判定为不支持
            if (err || (response && response.status === 403) || (data && data.indexOf('is not currently supported') !== -1)) {
                result["Gemini"] = "<b>Gemini: </b>未支持 🚫"
                return resolve()
            }

            // 2. 如果初步通过，请求定位接口获取地区 (参考 GPT 逻辑)
            $httpClient.get({url: GPT_RegionL_URL, node: nodeName, timeout: 5000}, (e, r, d) => {
                if (e || !d) {
                    result["Gemini"] = "<b>Gemini: </b>检测失败 ❗️"
                    return resolve()
                }
                
                let region = d.split("loc=")[1].split("\n")[0]
                
                // 3. 访问 Gemini 官方区域验证 API 最终确认
                $httpClient.get({url: GEMINI_REGIONS_URL, node: nodeName, timeout: 5000}, (apiE, apiR, apiD) => {
                    if (!apiE && apiR.status === 200) {
                        // 判定支持，并使用 flags.get 显示对应的国旗
                        result["Gemini"] = "<b>Gemini: </b>支持 " + arrow + "⟦" + flags.get(region.toUpperCase()) + "⟧ 🎉"
                    } else {
                        result["Gemini"] = "<b>Gemini: </b>未支持 🚫"
                    }
                    resolve()
                })
            })
        })
    })
}
