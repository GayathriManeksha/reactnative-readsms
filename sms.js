import React, { Component, useState } from "react";
import { NativeModules, Text, View } from "react-native";
// import * as ReadSms from 'react-native-read-sms/ReadSms';
import * as ReadSms from './ReadSms'
// const {ReadSMSModule:ReadSms} = NativeModules
// import * as Permissions from "expo-permissions";

export default class ReadSMSComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msgtext: null
        };
    }

    handleAddTask = () => {
        console.log("This", this.state.msgtext)
        fetch('https://read-sms.onrender.com/adddata',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Message: this.state.msgtext })
            })
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => console.log(error))
    }
    // getMoviesFromApi = () => {
    //     return fetch('https://reactnative.dev/movies.json')
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log(json.movies)
    //             return json.movies;
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // };

    getTasks = () => {
        fetch('https://read-sms.onrender.com/put', {
            // mode: 'no-cors',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error('error response not ok');
                }
                return response.json();
            })
            .then((json) => console.log(json))
            .catch((error) => { console.error('Error', error) });
    }

    componentDidMount = async () => {
        // const { status } = await Permissions.askAsync(Permissions.SMS);
        // if (status === 'granted') {
        this.startReadSMS();
        this.startListSMS();
        // }
    }

    startReadSMS = async () => {
        console.log("Start to read")
        const hasPermission = await ReadSms.requestReadSMSPermission();
        if (hasPermission) {
            console.log("has permission")
            ReadSms.startReadSMS((status, sms, error) => {
                console.log(status)
                if (status == "success") {
                    console.log("Great!! you have received new sms:", sms);
                    this.setState({ msgtext: sms })
                    this.handleAddTask()
                    this.getTasks()
                    // this.getMoviesFromApi()
                }
            });
        }
    }

    startListSMS = async () => {
        const hasPermission = await ReadSms.requestReadSMSPermission();
        if (hasPermission) {
            console.log("has got permission")

            var filter = {
                box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
                // the next 4 filters should NOT be used together, they are OR-ed so pick one
                read: 1, // 0 for unread SMS, 1 for SMS already read
                // _id: 1234, // specify the msg id
                // address: '+91 7736651529', // sender's phone number
                body: 'Hello', // content to match
                // the next 2 filters can be used for pagination
                indexFrom: 0, // start from index 0
                maxCount: 10, // count of SMS to return each time
            };
            console.log("Again")
            ReadSms.startListSMS(filter);
        }
    }

    componentWillUnmount = () => {
        ReadSms.stopReadSMS();
    }

    render() {
        return (

            <View>
                <Text>{"Waiting for SMS..."}</Text>
            </View>
        );
    }
}
