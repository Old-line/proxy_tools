/*
脚本引用https://gitlab.com/lodepuly/vpn_tool/-/raw/master/Resource/Script/Node_detection_tool/NodeUnlockDetection.js
*/
/*
 * 节点解锁查询
 * 感谢并修改自 https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js
 * 脚本功能：检查节点是否支持Dazn/Discovery/Param/Disney/Netflix/ChatGPT/YouTube解锁服务
 * 原作者：XIAO_KOP
 */
/*
脚本引用自：mphin & BOBOLAOSHIV587
修改：Old-line
功能：支持 Dazn/Discovery/Paramount/Disney/Netflix/ChatGPT/Gemini/YouTube 解锁服务检测
*/

const NF_BASE_URL = "https://www.netflix.com/title/81280792";
const DISNEY_BASE_URL = 'https://www.disneyplus.com';
const DISNEY_LOCATION_BASE_URL = 'https://disney.api.edge.bamgrid.com/graph/v1/device/graphql';
const YTB_BASE_URL = "https://www.youtube.com/premium";
const Dazn_BASE_URL = "https://startup.core.indazn.com/misl/v5/Startup";
const Param_BASE_URL = "https://www.paramountplus.com/";
const Discovery_token_BASE_URL = "https://us1-prod-direct.discoveryplus.com/token?deviceId=d1a4a5d25212400d1e6985984604d740&realm=go&shortlived=true";
const Discovery_BASE_URL = "https://us1-prod-direct.discoveryplus.com/users/me";
const GPT_BASE_URL = 'https://chat.openai.com/';
const GPT_RegionL_URL = 'https://chat.openai.com/cdn-cgi/trace';
const GEMINI_BASE_URL = 'https://gemini.google.com/';

var inputParams = $environment.params;
var nodeName = inputParams.node;

let flags = new Map([["AC","🇦🇨"],["AE","🇦🇪"],["AF","🇦🇫"],["AI","🇦🇮"],["AL","🇦🇱"],["AM","🇦🇲"],["AQ","🇦🇶"],["AR","🇦🇷"],["AS","🇦🇸"],["AT","🇦🇹"],["AU","🇦🇺"],["AW","🇦🇼"],["AX","🇦🇽"],["AZ","🇦🇿"],["BA","🇧🇦"],["BB","🇧🇧"],["BD","🇧🇩"],["BE","🇧🇪"],["BF","🇧🇫"],["BG","🇧🇬"],["BH","🇧🇭"],["BI","🇧🇮"],["BJ","🇧🇯"],["BM","🇧🇲"],["BN","🇧🇳"],["BO","🇧🇴"],["BR","🇧🇷"],["BS","🇧🇸"],["BT","🇧🇹"],["BV","🇧🇻"],["BW","🇧🇼"],["BY","🇧🇾"],["BZ","🇧🇿"],["CA","🇨🇦"],["CF","🇨🇫"],["CH","🇨🇭"],["CK","🇨🇰"],["CL","🇨🇱"],["CM","🇨🇲"],["CN","🇨🇳"],["CO","🇨🇴"],["CP","🇨🇵"],["CR","🇨🇷"],["CU","🇨🇺"],["CV","🇨🇻"],["CW","🇨🇼"],["CX","🇨🇽"],["CY","🇨🇾"],["CZ","🇨🇿"],["DE","🇩🇪"],["DG","🇩🇬"],["DJ","🇩🇯"],["DK","🇩🇰"],["DM","🇩🇲"],["DO","🇩🇴"],["DZ","🇩🇿"],["EA","🇪🇦"],["EC","🇪🇨"],["EE","🇪🇪"],["EG","🇪🇬"],["EH","🇪🇭"],["ER","🇪🇷"],["ES","🇪🇸"],["ET","🇪🇹"],["EU","🇪🇺"],["FI","🇫🇮"],["FJ","🇫🇯"],["FK","🇫🇰"],["FM","🇫🇲"],["FO","🇫🇴"],["FR","🇫🇷"],["GA","🇬🇦"],["GB","🇬🇧"],["HK","🇭🇰"],["HU","🇭🇺"],["ID","🇮🇩"],["IE","🇮🇪"],["IL","🇮🇱"],["IM","🇮🇲"],["IN","🇮🇳"],["IS","🇮🇸"],["IT","🇮🇹"],["JP","🇯🇵"],["KR","🇰🇷"],["LU","🇱🇺"],["MO","🇲🇴"],["MX","🇲🇽"],["MY","🇲🇾"],["NL","🇳🇱"],["PH","🇵🇭"],["RO","🇷🇴"],["RS","🇷🇸"],["RU","🇷🇺"],["RW","🇷🇼"],["SA","🇸🇦"],["SB","🇸🇧"],["SC","🇸🇨"],["SD","🇸🇩"],["SE","🇸🇪"],["SG","🇸🇬"],["TH","🇹🇭"],["TN","🇹🇳"],["TO","🇹🇴"],["TR","🇹🇷"],["TV","🇹🇻"],["TW","🇨🇳"],["UK","🇬🇧"],["UM","🇺🇲"],["US","🇺🇸"],["UY","🇺🇾"],["UZ","🇺🇿"],["VA","🇻🇦"],["VE","🇻🇪"],["VG","🇻🇬"],["VI","🇻🇮"],["VN","🇻🇳"],["ZA","🇿🇦"]]);

let result = {
    "title": '  节点解锁查询',
    "YouTube": '<b>YouTube: </b>检测失败，请重试 ❗️',
    "Netflix": '<b>Netflix: </b>检测失败，请重试 ❗️',
    "Dazn": "<b>Dazn: </b>检测失败，请重试 ❗️",
    "Gemini": '<b>Gemini: </b>检测失败，请重试 ❗️', 
    "ChatGPT": '<b>ChatGPT: </b>检测失败，请重试 ❗️', 
    "Disney": "<b>Disneyᐩ: </b>检测失败，请重试 ❗️",
    "Paramount" : "<b>Paramountᐩ: </b>检测失败，请重试 ❗️",
    "Discovery" : "<b>Discoveryᐩ: </b>检测失败，请重试 ❗️",
};

let arrow = " ➟ ";

Promise.all([ytbTest(), disneyLocation(), nfTest(), daznTest(), parmTest(), discoveryTest(), gptTest(), geminiTest()]).then(value => {
    let content = "------------------------------------</br>"+([result["Dazn"],result["Discovery"],result["Paramount"],result["Disney"],result["Netflix"],result["ChatGPT"],result["Gemini"],result["YouTube"]]).join("</br></br>")
    content = content + "</br>------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>节点</b> ➟ " + nodeName+ "</font>"
    content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
    $done({"title":result["title"],"htmlMessage":content})
}).catch (values => {
    let content = "------------------------------------</br>"+([result["Dazn"],result["Discovery"],result["Paramount"],result["Disney"],result["Netflix"],result["ChatGPT"],result["Gemini"],result["YouTube"]]).join("</br></br>")
    content = content + "</br>------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>节点</b> ➟ " + nodeName+ "</font>"
    content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
    $done({"title":result["title"],"htmlMessage":content})
})

// --- 各项检测函数 ---

function geminiTest() {
    return new Promise((resolve) => {
        let params = {
            url: GEMINI_BASE_URL,
            node: nodeName,
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' }
        }
        $httpClient.get(params, (err, resp, data) => {
            if (err || !data) {
                result["Gemini"] = "<b>Gemini: </b>检测失败 ❗️";
            } else if (data.indexOf('is not currently available') !== -1 || data.indexOf('goog-gt-tt') !== -1) {
                result["Gemini"] = "<b>Gemini: </b>未支持 🚫";
            } else if (resp.status == 200) {
                result["Gemini"] = "<b>Gemini: </b>支持 🎉";
            } else {
                result["Gemini"] = "<b>Gemini: </b>未支持 🚫";
            }
            resolve();
        })
    })
}

function nfTest() {
    return new Promise((resolve) => {
        let params = { url: NF_BASE_URL, node: nodeName, timeout: 6000, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15' } }
        $httpClient.get(params, (err, resp, data) => {
            if (err) { result["Netflix"] = "<b>Netflix: </b>检测失败 ❗️"; resolve(); return; }
            if (resp.status == 403) { result["Netflix"] = "<b>Netflix: </b>未支持 🚫"; }
            else if (resp.status == 404) { result["Netflix"] = "<b>Netflix: </b>支持自制剧集 ⚠️"; }
            else if (resp.status == 200) {
                let ourl = resp.headers['X-Originating-URL'] || resp.headers['X-Originating-Url'] || resp.headers['x-originating-url'];
                if (ourl) {
                    let region = ourl.split('/')[3].split('-')[0];
                    if (region == 'title') region = 'us';
                    result["Netflix"] = "<b>Netflix: </b>完整支持" + arrow + "⟦" + flags.get(region.toUpperCase()) + "⟧ 🎉";
                } else { result["Netflix"] = "<b>Netflix: </b>完整支持" + arrow + "⟦未知地区⟧ 🎉"; }
            } else { result["Netflix"] = "<b>Netflix: </b>检测失败 ❗️"; }
            resolve();
        })
    })
}

function ytbTest() {
    return new Promise((resolve) => {
        let params = { url: YTB_BASE_URL, node: nodeName, timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36' } }
        $httpClient.get(params, (err, resp, data) => {
            if (err || resp.status !== 200) { result["YouTube"] = "<b>YouTube: </b>检测失败 ❗️"; resolve(); return; }
            if (data.indexOf('Premium is not available') !== -1) { result["YouTube"] = "<b>YouTube: </b>未支持 🚫"; }
            else {
                let region = 'US';
                let ret = /"GL":"(.*?)"/gm.exec(data);
                if (ret && ret.length === 2) region = ret[1];
                result["YouTube"] = "<b>YouTube: </b>支持 " + arrow + "⟦" + flags.get(region.toUpperCase()) + "⟧ 🎉";
            }
            resolve();
        })
    })
}

function gptTest() {
    const support_countryCodes=["T1","XX","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ","BS","BD","BB","BE","BZ","BJ","BT","BA","BW","BR","BG","BF","CV","CA","CL","CO","KM","CR","HR","CY","DK","DJ","DM","DO","EC","SV","EE","FJ","FI","FR","GA","GM","GE","DE","GH","GR","GD","GT","GN","GW","GY","HT","HN","HU","IS","IN","ID","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KW","KG","LV","LB","LS","LR","LI","LT","LU","MG","MW","MY","MV","ML","MT","MH","MR","MU","MX","MC","MN","ME","MA","MZ","MM","NA","NR","NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PA","PG","PE","PH","PL","PT","QA","RO","RW","KN","LC","VC","WS","SM","ST","SN","RS","SC","SL","SG","SK","SI","SB","ZA","ES","LK","SR","SE","CH","TH","TG","TO","TT","TN","TR","TV","UG","AE","US","UY","VU","ZM","BO","BN","CG","CZ","VA","FM","MD","PS","KR","TW","TZ","TL","GB"];
    return new Promise((resolve) => {
        $httpClient.get({url: GPT_BASE_URL, node: nodeName, timeout: 5000}, (err, resp, data) => {
            if (err) { result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫"; resolve(); return; }
            if (JSON.stringify(data).indexOf("text/plain") == -1) {
                $httpClient.get({url: GPT_RegionL_URL, node: nodeName, timeout: 5000}, (emsg, res, resData) => {
                    if (emsg) { result["ChatGPT"] = "<b>ChatGPT: </b>检测失败 ❗️"; resolve(); return; }
                    let region = resData.split("loc=")[1].split("\n")[0];
                    if (support_countryCodes.indexOf(region) != -1) {
                        result["ChatGPT"] = "<b>ChatGPT: </b>支持 " + arrow + "⟦" + flags.get(region.toUpperCase()) + "⟧ 🎉";
                    } else { result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫"; }
                    resolve();
                })
            } else { result["ChatGPT"] = "<b>ChatGPT: </b>未支持 🚫"; resolve(); }
        })
    })
}

function disneyLocation() {
    return new Promise((resolve) => {
        let params = {
            url: DISNEY_LOCATION_BASE_URL,
            node: nodeName,
            timeout: 5000,
            headers: { 'Accept-Language': 'en', "Authorization": 'ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84', 'Content-Type': 'application/json', 'User-Agent': 'UA' },
            body: JSON.stringify({ query: 'mutation registerDevice($input: RegisterDeviceInput!) { registerDevice(registerDevice: $input) { grant { grantType assertion } } }', variables: { input: { applicationRuntime: 'chrome', attributes: { browserName: 'chrome', browserVersion: '94.0.4606', manufacturer: 'microsoft', operatingSystem: 'windows', operatingSystemVersion: '10.0', osDeviceIds: [] }, deviceFamily: 'browser', deviceLanguage: 'en', deviceProfile: 'windows' } } })
        }
        $httpClient.post(params, (err, resp, data) => {
            if (err || resp.status !== 200) { result["Disney"] = "<b>Disneyᐩ: </b>检测失败 ❗️"; resolve(); return; }
            let resData = JSON.parse(data);
            if (resData?.extensions?.sdk?.session) {
                let { inSupportedLocation, location: { countryCode } } = resData.extensions.sdk.session;
                result["Disney"] = inSupportedLocation ? "<b>Disneyᐩ: </b>支持 " + arrow + "⟦" + flags.get(countryCode.toUpperCase()) + "⟧ 🎉" : "<b>Disneyᐩ: </b>即将登陆 " + arrow + "⟦" + flags.get(countryCode.toUpperCase()) + "⟧ ⚠️";
            } else { result["Disney"] = "<b>Disneyᐩ: </b>未支持 🚫"; }
            resolve();
        })
    })
}

function daznTest() {
    return new Promise((resolve) => {
        $httpClient.post({ url: Dazn_BASE_URL, node: nodeName, timeout: 5000, headers: { 'User-Agent': 'Mozilla/5.0', "Content-Type": "application/json" }, body: JSON.stringify({"LandingPageKey":"generic","Platform":"web","Manufacturer":"","Version":"2"}) }, (err, resp, data) => {
            if (err || resp.status !== 200) { result["Dazn"] = "<b>Dazn: </b>检测失败 ❗️"; resolve(); return; }
            let ret = /"GeolocatedCountry":"(.*?)"/gm.exec(data);
            if (ret && ret.length === 2) { result["Dazn"] = "<b>Dazn: </b>支持 " + arrow + "⟦" + flags.get(ret[1].toUpperCase()) + "⟧ 🎉"; }
            else { result["Dazn"] = "<b>Dazn: </b>未支持 🚫"; }
            resolve();
        })
    })
}

function parmTest() {
    return new Promise((resolve) => {
        $httpClient.get({ url: Param_BASE_URL, node: nodeName, timeout: 5000 }, (err, resp) => {
            if (err) { result["Paramount"] = "<b>Paramountᐩ: </b>检测失败 ❗️"; }
            else if (resp.status == 200) { result["Paramount"] = "<b>Paramountᐩ: </b>支持 🎉"; }
            else { result["Paramount"] = "<b>Paramountᐩ: </b>未支持 🚫"; }
            resolve();
        })
    })
}

function discoveryTest() {
    return new Promise((resolve) => {
        $httpClient.get({ url: Discovery_token_BASE_URL, node: nodeName, timeout: 5000 }, (err, resp, data) => {
            if (err || resp.status !== 200) { result["Discovery"] = "<b>Discoveryᐩ: </b>检测失败 ❗️"; resolve(); return; }
            let token = JSON.parse(data)["data"]["attributes"]["token"];
            $httpClient.get({ url: Discovery_BASE_URL, node: nodeName, timeout: 5000, headers: { "Cookie": `st=${token}` } }, (e, r, d) => {
                if (!e && r.status == 200 && JSON.parse(d)["data"]["attributes"]["currentLocationTerritory"] == 'us') {
                    result["Discovery"] = "<b>Discoveryᐩ: </b>支持 🎉";
                } else { result["Discovery"] = "<b>Discoveryᐩ: </b>未支持 🚫"; }
                resolve();
            })
        })
    })
}
