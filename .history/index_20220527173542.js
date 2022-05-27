nod econst admin = require("firebase-admin");
const express = require('express')
const app = express()

var serviceAccount = require("./tinbk-48003-firebase-adminsdk-jjo22-7021491d5b.json");
const { useState } = require("react/cjs/react.production.min");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json())

app.post('/notifications', (req,res) => {
    console.log(req.body.buyerId)
    admin.firestore().collection('Users').doc(req.body.buyerId).get()
    .then(buyerSnapshot => {
        admin.firestore().collection('Users').doc(req.body.book.seller).get()
        .then(sellerSnapshot => {
            handleRegisterToBuy(buyerSnapshot.data(),sellerSnapshot.data(),req.body.book)
        })
    })    
})

async function handleRegisterToBuy(buyerInfo, sellerInfo, book) {
    console.log(buyerInfo, sellerInfo, book)
    await admin.messaging().sendToDevice(
        sellerInfo.tokens,
        {
            data: {
                buyer: JSON.stringify(buyerInfo),
                seller: JSON.stringify(sellerInfo),
                book: JSON.stringify(book)
            }
        },
        {
            priority: 'high',
        }
    )
}

app.listen(3000, () => {
    console.log('server running')
})