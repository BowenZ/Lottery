var express = require('express');
var router = express.Router();

const sign = require('../common/weixin-sign.js');
const request = require('request-promise');
const http = require('http');
const url = require('url');

// 在“微信公众平台-开发-基本配置”页中获得AppID和AppSecret
const APPID = 'wx9860aed4ec6b0f65';
const APPSECRET = '24ba58e92e9971e12a9ad04a70138da9';
// accessToken和jsapiTicket有效期为7200s
const TASKTIMER = 7200000;
let accessToken;
let jsapiTicket;

/**
 * 获取access_token和jsapiTicket
 *
 * @return {Promise} promise 获取两个参数用于生成签名
 */
function getAccessToken() {
  return request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`)
    .then(function(body) {
      accessToken = JSON.parse(body).access_token;
      return request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`);
    })
    .then(function(body) {
      jsapiTicket = JSON.parse(body).ticket;
    });
}

/**
 * 增加定时任务，刷新accessToken和jsapiTicket
 *
 */
setInterval(function() {
  getAccessToken();
}, TASKTIMER);

router.get('/sign', function(req, res) {
  let url = req.query.url
  if (typeof jsapiTicket === 'undefined') {
    // 初始化时没有jsapiTicket，主动获取
    getAccessToken().then(function() {
      let signature = sign(jsapiTicket, url);
      Object.assign(signature, {appId: APPID});
      res.json(signature)
    });
  } else {
    let signature = sign(jsapiTicket, url);
    Object.assign(signature, {appId: APPID});
    res.json(signature)
  }
})

module.exports = router;