module.exports = {
  "login": {
    // 第1引数：S3からの音楽
    // 第2引数：風鈴の種類
    "speak": "<audio src=\"https://s3-ap-northeast-1.amazonaws.com/a-umakatsu-s3-image/alexa-skill-furin/%s.mp3\" />。%s。ばいばい。"
  },
  "error": {
    "speak": "風鈴の種類が聞き取れなかったよ。鉄器、能作風鈴、小樽、ダイソーの中から選んで？",
    "reprompt": "鉄器、能作風鈴、小樽、ダイソーの中から選んで？"
  },
  "exit": {
    "speak": "ばいばい。"
  },
  "help": {
    "speak": "風鈴の音をお届けするよ。1分ほど風鈴の音を流すので涼んでね。最後に風鈴の種類を教えるので購入に悩んでるなら参考にしてね。鉄器、能作風鈴、小樽、ダイソーの中から選んで？",
    "reprompt": "鉄器、能作風鈴、小樽、ダイソーの中から選んで？"
  },
  "furin": {
    "nanbu_mie": "三重県の南部鉄器の風鈴でした",
    "daiso": "ダイソーの風鈴でした",
    "nousaku": "能作の風鈴でした",
    "otaru": "小樽の風鈴でした"
  }
};
