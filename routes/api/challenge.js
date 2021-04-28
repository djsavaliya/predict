const { response } = require("express");
const express = require("express");
const app = express();
const Challenge = require("../../models/challenge");
const Match = require("../../models/match");
const User = require("../../models/user");
const Notification = require("../../models/notification");
const {env} = require("../../config/keys");

module.exports = app => {
    app.post('/api/create_challenge', async (req, res) => {
        try {
            const user = req.user
            if (!user) {
                res.send({ success: 0 })
                return
            }
            const matchID = parseInt(req.body.matchID)
            const betAmount = req.body.betAmount
            const selectedFriends = req.body.selectedFriends
            const selectedTeam = req.body.selectedTeam

            if (!matchID || !betAmount || !selectedTeam || !selectedFriends) {
                res.send({ success: 0 })
                return
            }
            const match = await Match.findOne({ matchID: matchID })
            const curTimestamp = new Date().getTime()
            if (match.timestamp < curTimestamp) {
                res.send({ success: 0 })
                return
            }
            if (betAmount * selectedFriends.length > user.rewardCoins) {
                res.send({ success: 0 })
                return
            }
            let p = 0
            await Promise.all(selectedFriends.map(async (id) => {
                const check1 = await Challenge.findOne({ matchID: matchID, userID1: user._id, userID2: id })
                const check2 = await Challenge.findOne({ matchID: matchID, userID1: id, userID2: user._id })
                if (check1 || check2) return
                p += 1
            }))
            if (p !== selectedFriends.length) {
                res.send({ success: 0 })
                return
            }
            await Promise.all(selectedFriends.map(async (id) => {
                const userID1 = selectedTeam === 'home' ? user._id : id
                const userID2 = selectedTeam === 'home' ? id : user._id
                await new Challenge({
                    userID1: userID1,
                    userID2: userID2,
                    accepted: false,
                    matchID: matchID,
                    betAmount: betAmount,
                    winner: 'nil',
                    sentBy: selectedTeam
                }).save()
                console.log('Saved Challenge')
                
                await new Notification({
                    userID: userID2,
                    message: user.name + " has challenged you for a battle!",
                    link: env=="dev"?"http://localhost:3000/bets/0":"https://predict-webapp.herokuapp.com/bets/0",
                    timestamp: new Date().getTime(),
                }).save();
                console.log("Notification created!");
            
            }))

            res.send({ success: 1 })


        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }
    })

    app.post('/api/get_challenges', async (req, res) => {
        try {
            const user = req.user
            if (!user) {
                res.send({ success: 0 })
                return
            }

            let challenges = []
            const challenge1 = await Challenge.find({ userID1: user._id })
            if (challenge1) {
                challenges = [...challenges, ...challenge1]
            }
            const challenge2 = await Challenge.find({ userID2: user._id })
            if (challenge2) {
                challenges = [...challenges, ...challenge2]
            }
            let finalResult = []
            await Promise.all(challenges.map(async (challenge) => {
                let combinedRes = {}
                const otherUserID = challenge.userID1 == user._id ? challenge.userID2 : challenge.userID1
                const otherUser = await User.findOne({ _id: otherUserID })
                combinedRes.otherUser = otherUser
                combinedRes.challenge = challenge
                const match = await Match.findOne({ matchID: challenge.matchID })
                combinedRes.match = match
                finalResult.push(combinedRes)
            }))
            res.send({ success: 1, result: finalResult })
        } catch (e) {
            console.log(e)
            res.send("0")
        }
    })
    app.post('/api/withdraw_challenge', async (req, res) => {
        try {
            const user = req.user
            if (!user) {
                res.send({ success: 0 })
                return
            }
            const id = req.body.id
            const challenge = await Challenge.findOne({ _id: id })
            if (user._id != challenge.userID1 &&  user._id!=challenge.userID2) {
                res.send({ success: 0 })
                return
            }
            if (!challenge.accepted) {
                await challenge.delete()
                res.send({ success: 1 })
            }
            const match = await Match.findOne({ matchID: challenge.matchID })
            const curTimestamp = new Date().getTime()
            if (match.timestamp < curTimestamp) {
                res.send({ success: 0 })
                return
            }
            const otherUserID = user._id === challenge.userID1 ? challenge.userID2 : challenge.userID1
            const otherUser = await User.findOne({ _id: otherUserID })
            otherUser.set({ rewardCoins: otherUser.rewardCoins + challenge.betAmount })
            await otherUser.save()
            user.set({ rewardCoins: user.rewardCoins + challenge.betAmount })
            await user.save()
            await Match.updateOne({ matchID: challenge.matchID }, { $pull: { challenges: challenge._id } })
            await challenge.delete()
            
            await new Notification({
                userID: otherUserID,
                message: user.name + " has rejected your challenge for a battle!",
                link: env=="dev"?"http://localhost:3000/bets/0":"https://predict-webapp.herokuapp.com/bets/0",
                timestamp: new Date().getTime(),
            }).save();
            console.log("Notification created!");

            res.send({ success: 1 })
            return
        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
        }

    })

    app.post('/api/accept_challenge', async (req, res) => {
        try {
            const user = req.user
            if (!user) {
                res.send({ success: 0 })
                return
            }
            const id = req.body.id

            const challenge = await Challenge.findOne({ _id: id })
            if (!challenge) {
                res.send({ success: 0 })
                return
            }
            const match = await Match.findOne({ matchID: challenge.matchID })
            const curTimestamp = new Date().getTime()
            if (match.timestamp < curTimestamp) {
                await challenge.delete()
                res.send({ success: 0 })
                return
            }
            if (user.rewardCoins < challenge.betAmount) {
                await challenge.delete()
                res.send({ success: 0 })
                return
            }
            const otherUserID = user._id === challenge.userID1 ? challenge.userID2 : challenge.userID1
            const otherUser = await User.findOne({ _id: otherUserID })
            if (otherUser.rewardCoins < challenge.betAmount) {
                await challenge.delete()
                res.send({ success: 0 })
                return
            }

            otherUser.set({ rewardCoins: otherUser.rewardCoins - challenge.betAmount })
            await otherUser.save()
            user.set({ rewardCoins: user.rewardCoins - challenge.betAmount })
            await user.save()
            challenge.set({ accepted: true })
            await challenge.save()
            await Match.updateOne({ matchID: matchID }, { $push: { challenges: challenge._id } })

            await new Notification({
                userID: otherUserID,
                message: user.name + " has accepted your challenge for a battle!",
                link: env=="dev"?"http://localhost:3000/bets/0":"https://predict-webapp.herokuapp.com/bets/0",
                timestamp: new Date().getTime(),
            }).save();
            console.log("Notification created!");

            res.send({ success: 1 })
        } catch (e) {
            console.log(e)
            res.send({ success: 0 })
            return
        }
    })



}