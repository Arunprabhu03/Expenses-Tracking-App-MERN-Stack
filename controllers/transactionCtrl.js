const transactionModel = require("../models/transactionModel");
const moment = require("moment");

const getAllTransaction = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body;
        const query = {
            userid: req.body.userid,
            ...(type !== "all" && { type }),
        };

        if (frequency === "all") {
            // No date filter applied
        } else if (frequency === "custom") {
            query.date = {
                $gte: selectedDate[0],
                $lte: selectedDate[1],
            };
        } else {
            query.date = {
                $gt: moment().subtract(Number(frequency), "d").toDate(),
            };
        }

        const transactions = await transactionModel.find(query);
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


const deleteTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndDelete({ _id: req.body.transactionId });
        res.status(200).send("Transaction Deleted!");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
const editTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndUpdate(
            { _id: req.body.transactionId },
            req.body.payload
        );
        res.status(200).send("Edited Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        res.status(201).send("Transaction Created!");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {
    getAllTransaction,
    addTransaction,
    editTransaction,
    deleteTransaction,
};