const Customer = require('../models/customerSchema');
const nodemailer = require('nodemailer');
const {
  Keypair,
  TransactionBuilder,
  Operation,
  Networks
} = require('diamante-base');
const { Horizon,Asset } = require('diamante-sdk-js');
var email='chemconupdate1@gmail.com';
var pass='szfesegxwqlzgjqm';

const getBalance=async (req, res) => {
  try{
      const pkey=req.query.pkey;
      const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
      const account = await server.loadAccount(pkey);
      console.log("Balances for last account: " + pkey);
      account.balances.forEach(function (balance) {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
      res.send({balance:balance.balance,status:true});
    });
  }
  catch(e){
      console.log(e);
      res.send({err:e,balance:0,status:false});
  }
}
const sendMoney=async (req,res)=>{
  try{
      const senderSecret="SBBXMWUSGQDDH73N3NICSCFH3B5NQA3QF6PZ7KRIZPNFIOCE7JI4NGZ3";
      const amount="1";
      const {key} = req.body;
      console.log(`Received request to make payment from ${senderSecret} to ${key} with amount ${amount}`);

      const server = new Horizon.Server('https://diamtestnet.diamcircle.io/');
      const senderKeypair = Keypair.fromSecret(senderSecret);
      const senderPublicKey = senderKeypair.publicKey();

      const account = await server.loadAccount(senderPublicKey);
      const transaction = new TransactionBuilder(account, {
          fee: await server.fetchBaseFee(),
          networkPassphrase: Networks.TESTNET,
      })
          .addOperation(Operation.payment({
              destination: key,
              asset: Asset.native(),
              amount: amount,
          }))
          .setTimeout(30)
          .build();

      transaction.sign(senderKeypair);
      const result = await server.submitTransaction(transaction);
      console.log(`Payment made from ${senderPublicKey} to ${key} with amount ${amount}`);
      res.json({ message: `Payment of ${amount} DIAM made to ${key} successfully`,status:true });
  }
  catch(e)
  {
      console.log(e);
      res.send({err:e,status:false});
  }
}
async function sendOTPViaEmail(emailed, otp) { 
    console.log("EMAIL DATA: "+emailed+" "+otp);
  
    try{ 
    console.log(emailed); 
    const transporter = nodemailer.createTransport({ 
      host: 'smtp.gmail.com', 
      port: 465, 
      secure: true, 
      auth: { 
        user: email, 
        pass: pass, 
      },
      tls: {
        rejectUnauthorized: false,
      },
    }); 
      const mailOptions = { 
        from: email, 
        to: emailed, 
        subject: "SupplyX Have just delivered your OTP!",
        html: `
            <body>
                <h3 style="font-family:Sans-Serif;color:#190482;">
                   Your OTP IS: ${otp},<br/><br/>
                   If you did not request this OTP, please ignore this email and do not share the OTP with anybody else.
                </h3>
            </body>`, 
    }; 
     
      // Send the email 
      transporter.sendMail(mailOptions, (error, info) => { 
        if (error) { 
          console.log(error); 
        } else { 
          console.log(`Email sent: ${info.response}`); 
        } 
      });        
    } 
    catch(err) 
    { 
      console.log(err) 
    } 
  }
  const getAll = async (req, res) => {
    try{
      const customers = await Customer.find();
      res.status(200).json(customers);
    }
    catch(err){
      res.status(500).json({ error: err.message });
    }
  }
  const sendOtp = async (req, res) => {
    const {email,otp} = req.body;
    console.log(req.body);
    try {
      sendOTPViaEmail(email,otp);
      res.status(200).json({ message: "OTP sent successfully!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
const createCustomer = async (req, res) => {
    const { name,companyEmail, walletAddress } = req.body;
    console.log(req.body);
    try {
      const keypair = Keypair.random();
      console.log('Keypair created:', keypair.publicKey(), keypair.secret());
      const pkey=keypair.publicKey();
      const skey=keypair.secret();
      const fetch = await import('node-fetch').then(mod => mod.default);
      const response = await fetch(`https://friendbot.diamcircle.io/?addr=${pkey}`);
      if (!response.ok) {
          throw new Error(`Failed to activate account ${pkey}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(`Account ${pkey} activated`, result);

      const newUser = new Customer({
        name: name,
        email: companyEmail,
        walletAddress:walletAddress,
        type: "user",
        pkey:pkey,
        skey:skey
      });
      
      await newUser.save();
      res.status(200).json({ message: "Signup successful!" });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong. Please try again."});
    }
}

const loginCustomer = async (req, res) => {
    console.log(req.body)
  console.log(req.body.walletAddress)
  const wallet= req.body.walletAddress;
  try {
    const user = await Customer.findOne({ walletAddress:wallet});
    console.log(user)
    if (user) {
      res.status(200).json({ message: "Login successful!", user });
    } else {
      res.status(401).json({ message: "Wallet address not found. Please sign up first." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {createCustomer, loginCustomer, sendOtp, sendMoney,getBalance,getAll };
