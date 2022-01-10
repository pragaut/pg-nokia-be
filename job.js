/**
 * this module will be used for creating automated jobs.
 *
 * The JOB will have a separate module altogether for DB connection.
 * We will not Sequelize as the Payment Job should be light and should NOT have any extra dependency
 *
 *
 */

const mysql = require('mysql2');
//const razorPay = require('./util/razor.pay.wrapper');
//const logger = require('./util/logger');
const util = require('./util');
const cronJob = require('node-cron');
const dal = require('./dal')
const { db } = require('./models');
const firebase = require("./firebase");
const _ = require('lodash')
//util.initApp();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
});


connection.connect((err) => {
  if (err) throw err;
});

// // DB Connected

const dateAdd = (date, interval, units) => {
  let ret = new Date(date); // don't change original date
  const checkRollover = () => { if (ret.getDate() !== date.getDate()) ret.setDate(0); };

  switch (interval.toLowerCase()) {
    case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
    case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
    case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
    case 'week': ret.setDate(ret.getDate() + 7 * units); break;
    case 'day': ret.setDate(ret.getDate() + units); break;
    case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
    case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
    case 'second': ret.setTime(ret.getTime() + units * 1000); break;
    default: ret = undefined; break;
  }
  return ret;
};


// Schedule a task to run every minute.
cronJob.schedule('* * * * *', () => { console.log("Task is running every minute :", new Date()) });
cronJob.schedule('*/03 * * * *', () => {
  console.log("Task is running every two minute :", new Date())
  try {
    connection.query("CALL asp_nk_cm_get_notification_master_details('','','','');", (error, results, fields) => {
      if (error) {
        console.error(error.message);
      }
      else if (results) {
        //console.log("results : ", results);       
        if (results && results.length > 0) {
          for (var item of results[0]) {
            console.log(item);
            //item.escalationFunctionName(item);
            //console.log("item.escalationFunctionName : ", item.escalationFunctionName);
            let notificatioCode = item && item.notificationCode;
            switch (notificatioCode) {
              case "INC":
                internetNotConnectedAlarm(item);
              //  break;
              // default:
              //  break;
            }
          }
        }

      }
    });
  }
  catch (error) {
    console.log("error : ", error);
  }
});


const internetNotConnectedAlarm = async (notificationDetails) => {
  //
  try {
    let notificationCode = notificationDetails && notificationDetails.notificationCode ? notificationDetails.notificationCode : 'INC';
    let message = notificationDetails && notificationDetails.message ? notificationDetails.message : '';
    let title = notificationDetails && notificationDetails.title ? notificationDetails.title : '';

    const promise = new Promise((resolve, reject) => {
      db.sequelize.query('call asp_nk_get_tmc_internet_not_conneted_details(:p_notificationCode)', {
        replacements: {
          p_notificationCode: notificationCode
        }
      }).then((result) => {
        resolve(result);
        console.log("--------internetNotConnectedAlarm------", result)
        let macAddressArray = [];
        let receiverIdArray = [];
        const mappedArray =   result && result.length > 0 &&   _.map(result,'macAddress')
        const mappedArray2 =   result && result.length > 0 &&   _.map(result,'receiverId')
        result && result.length > 0 && result.forEach(element => {
          macAddressArray.push(element.macAddress);
          receiverIdArray.push(element.receiverId);
        }
        ); 
       // const mappedArray = _.map(macAddressArray)
        const uniqueadta = macAddressArray && macAddressArray.length > 0 && _.uniq(macAddressArray)
        const uniqueReceiverId = receiverIdArray && receiverIdArray.length > 0 && _.uniq(receiverIdArray)

        uniqueadta && uniqueadta.forEach(reminder => {
          SaveNotificationDetails(notificationDetails, reminder);
        });

        if (uniqueReceiverId) {
          pushFCMNotificationDetails(uniqueReceiverId, title, message)
        }

      }).catch((error) => {
        console.log('error -------------', error);
        reject(error);
      });
    });

    await promise;

    //const capturedResult = await razorPay.capture(id, amount);
  }
  catch (error) {
    console.log("error : ", error);
  }
};

const SaveNotificationDetails = async (notificationDetails, macAddress) => {
  //
  try {
    console.log("notificationDetails 1 3434----------------: ", notificationDetails);

    let message = notificationDetails && notificationDetails.message ? notificationDetails.message : '';
    let title = notificationDetails && notificationDetails.title ? notificationDetails.title : '';
    let notificationCode = notificationDetails && notificationDetails.notificationCode ? notificationDetails.notificationCode : '';
    let towerMonitoringNotificationDetailid = dal.uuid(db.towerMonitoringNotificationDetails.name);

    const promise = new Promise((resolve, reject) => {

      db.sequelize.query('call asp_nk_save_tower_monitoring_notification_details(:p_tower_monitoring_notification_detail_id,:p_mac_address,:p_notification_code,:p_title,:p_message,:p_data_time,:p_created_by)', {
        replacements: {
          p_tower_monitoring_notification_detail_id: towerMonitoringNotificationDetailid,
          p_mac_address: macAddress,
          p_notification_code: notificationCode,
          p_title: title,
          p_message: message,
          p_data_time: new Date(),
          p_created_by: '-1',
        }
      }).then((result) => {
        resolve(result);
        console.log('----------SaveNotificationDetails----------', result)
      }).catch((error) => {
        reject(error);
      });
    });
    await promise;
  }
  catch (error) {
    console.log("error : ", error);
  }
};

const pushFCMNotificationDetails = async (receiverIds, title, message) => {
  try {
    console.log("-------------pushFCMNotificationDetails----receiverIds-----------", receiverIds)
    const promise = new Promise((resolve, reject) => {
      firebase.sendMessageToDevice(receiverIds, title, message).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
    await promise;
  }
  catch (error) {
    console.log("error : ", error);
  }
};
 //-----------------Final Audit Auto Submission Job----------------------------

 //-----------------------End------------------------------------------------



 // /**
 //  * It will take the payment id, and capture it
 //  */
 // const capturePayment = async (id, amount) => {
 //   // when we capture a payment, we need to make sure that the status is rolled back to the DB

 //   // if we an error in this method, let's just send an email

 //   // To-do, let's try to make it a multiple statement instead of one by one
 //   //
 //   const capturedResult = await razorPay.capture(id, amount);

 //   // once captured, let's store it in DB
 //   const promise = new Promise((resolve, reject) => {
 //     db.sequelize.query('call set_razory_pay_status(:razorPayId, :razorPayStatus, :capturedAt);', {
 //       replacements: { razorPayId: id, razorPayStatus: capturedResult.status, capturedAt: capturedResult.created_at },
 //     }).then((result) => {
 //       resolve(result);
 //     }).catch((error) => {
 //       reject(error);
 //     });
 //   });

 //   await promise;
 // };


 // /**
 //  * Capturing payment on Razor Pay
 //  */

 // const autoCaptureAll = async () => {
 //   try {
 //     //
 //     /**
 //          * let's do this:
 //          * We will run this job every 30 minutes to capture the payment.
 //          * This will be handy if a payment was not captured initially while completing the payment
 //          */

 //     const paymentTo = Number(new Date());
 //     const paymentFrom = Number(dateAdd(paymentTo, 'minute', -30));

 //     const payments = await razorPay.getPayments(paymentFrom, paymentTo);

 //     /** To-do: we should not hit DB multiple times, so we will collect all the ids and do only 3-4 requests */


 //     // let's loop through all the payments and find if there are any items to authorize.

 //     payments.forEach(async (payment) => {
 //       try {
 //         if (payment.status === 'authorized' && payment.entity === 'payment') {
 //           // ok, we need to capture it
 //           await capturePayment(payment.id, payment.amount);
 //         } else {
 //           const promise = new Promise((resolve, reject) => {
 //             db.sequelize.query('call set_razory_pay_status(:razorPayId, :razorPayStatus, :capturedAt);', {
 //               replacements: { razorPayId: payment.id, razorPayStatus: payment.status, capturedAt: new Date() },
 //             }).then((result) => {
 //               resolve(result);
 //             }).catch((error) => {
 //               reject(error);
 //             });
 //           });

 //           await promise;
 //         }
 //       } catch (error) {
 //         let description = `Error in Payment Job. Razor Pay Id: ${payment.Id}\n\n`;
 //         if (error.error) {
 //           description += error.error.description;
 //         } else {
 //           description += error.message;
 //         }
 //         const newError = new Error(description);
 //         logger.logError('Payment Capture Job', '', newError, true);
 //       }
 //     });
 //   } catch (error) {
 //     if (error.error) {
 //       const newError = new Error(error.error.description);
 //       logger.logError('Payment Capture Job', '', newError, true);
 //     } else {
 //       logger.logError('Payment Capture Job', '', error, true);
 //     }
 //   }
 // };




