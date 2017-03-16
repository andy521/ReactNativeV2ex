import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ListView,
  PixelRatio,
  TouchableHighlight,
  RefreshControl
} from 'react-native';
import { observer } from 'mobx-react/native';
import EventEmitter from 'eventemitter3';
import HomeStore from '../store/home';
import TopicItem from '../components/topic-item';
import Toast from '../components/toast';

@observer
class HomeScreen extends Component {
  componentDidMount() {
    this.initTopics();
  }

  async initTopics() {
    const { fetchTopics, fetchCachedTopics } = this.props.store;
    await fetchCachedTopics();
    fetchTopics();
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight
        key={rowData.id}
        underlayColor="#f1f1f1"
        onPress={() => {
          highlightRow(sectionID, rowID)
          this.gotoTopic(rowData);
        }}>
        <View>
          <TopicItem showNode={true} rowData={rowData} />
        </View>
      </TouchableHighlight>
    );
  }

  gotoTopic(rowData) {
    const { navigate } = this.props.navigation;
    navigate('Topic', { rowData });
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View
        key={`separator-${sectionID}-${rowID}`}
        style={styles.separator}></View>
    );
  }

  render() {
    const {
      dataSource,
      refreshing,
      fetchTopics,
      loadingStatus
    } = this.props.store;
    return (
      <View style={styles.container}>
        <ListView
          initialListSize={20}
          dataSource={dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
          renderSeparator={this.renderSeparator}
          refreshControl={
            <RefreshControl
              title="加载中..."
              onRefresh={fetchTopics}
              refreshing={refreshing} />
          } />
        <Toast type={loadingStatus} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    backgroundColor: '#DCDCDC',
    height: 1 / PixelRatio.get()
  },
  tabIcon: {
    width: 22,
    height: 22,
    borderRadius: 4
  }
});

const ee = new EventEmitter();
const store = new HomeStore(ee);

export default class extends Component {
  static navigationOptions = {
    title: 'V2EX',
    tabBar: {
      icon: ({ tintColor }) => {
        return (
          <View style={[styles.tabIcon, {backgroundColor: tintColor}]}></View>
        );
      }
    }
  }

  render() {
    return (
      <HomeScreen eventEmitter={ee} store={store} {...this.props} />
    );
  }
}