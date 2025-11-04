import React, { Component } from 'react';
import {createAppContainer , createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {
        LoginPage,
        Home,
        AbsensiFoto,
        AbsensiMaps,
        HistoryAbsensi,
        // RoomChat,
        // Chatting,
        InputAbsenDinas,
        HistoryOtorPerjadin,
        ApprovalPerjadin,
    } from '../../containers/pages'

const HomeStack = createStackNavigator(
    {
        Home,
        AbsensiFoto,
        AbsensiMaps,
        HistoryAbsensi,
        // RoomChat,
        // Chatting,
        InputAbsenDinas,
        HistoryOtorPerjadin,
        ApprovalPerjadin,
    },
    {
        headerMode : 'none',
        initialRouteName : 'Home'
    }
);

const LoginStack = createStackNavigator(
    {
        LoginPage: {
            screen: LoginPage,
        },
    },
    {
        headerMode : 'none',
        initialRouteName : 'LoginPage'
    }
);

const Router = createSwitchNavigator(
    {   
        LoginStack,
        HomeStack,
    },
    {
        headerMode : 'none',
        initialRouteName: 'LoginStack'
    }
);

    
  export default createAppContainer(Router);