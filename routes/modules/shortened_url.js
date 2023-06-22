const express = require('express')
const router = express.Router()
const URL = require('../../models/url')

const buildTable = () => {
  const randomTable = []
  for (let i = 0; i < 10; i++) {
    randomTable.push(i.toString())
  }
  for (let i = 0; i < 26; i++) {
    randomTable.push(String.fromCharCode(65 + i))
    randomTable.push(String.fromCharCode(97 + i))
  }
  return randomTable
}

const url_shortener = () => {
  const randomTable = buildTable()
  let shortened_url = ""
  for (let i = 0; i < 5; i++) {
    shortened_url += randomTable[Math.floor(Math.random() * 62)]
  }
  return shortened_url
}

router.post('/', (req, res) => {
  const origin_url = req.body.url

  if (!origin_url.trim()) {
    const isEmpty = true
    return res.render('index', { isEmpty })
  }

  URL.findOne({ origin_url })
      .lean()
      .then(url => {
        if (!url) {
          const shortened_url = url_shortener()
          return URL.create({ origin_url, shortened_url })
            .then((url) => res.render('shortened_url', { shortened_url, _id: url._id }))
            .catch(error => console.log(error))
        } else {
          return res.render('shortened_url', { shortened_url: url.shortened_url, _id: url._id })
        }
      })
})

module.exports = router