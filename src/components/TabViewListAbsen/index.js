import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);



const TabViewListAbsen=(props) => {
  const index = 0
  const routes = {
  index: 1,
  routes: [
    { key: 'music', title: 'Music' },
    { key: 'albums', title: 'Albums' },
    { key: 'recents', title: 'Recents' },
    { key: 'purchased', title: 'Purchased' },
  ]
}
  return (
    <TabView
        navigationState={{ index, routes }}
        onIndexChange={0}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
      />
  );
}

export default TabViewListAbsen;