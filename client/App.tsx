import React, { useState, useEffect, useRef } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import socketIOClient from "socket.io-client";

const host = "http://localhost:3000";

function App() {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host)
    socketRef.current.on('getId', data => {
      setId(data)
    }) // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.

    socketRef.current.on('sendDataServer', dataGot => {
      console.log('sendDataServer', dataGot)
      setMess(oldMsgs => [...oldMsgs, dataGot.data])
    }) // mỗi khi có tin nhắn thì mess sẽ được render thêm 

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id
      }
      socketRef.current.emit('sendDataClient', msg)

      /*Khi emit('sendDataClient') bên phía server sẽ nhận được sự kiện có tên 'sendDataClient' và handle như câu lệnh trong file index.js
            socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
              socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
            })
      */
      setMessage('')
    }
  }

  return (
    <>
      <FlatList
        inverted={true}
        data={mess}
        style={styles.containerList}
        renderItem={({ item, index }) => {
          return (
            <View style={[styles.item, {
              alignSelf: id == item.id ? 'flex-end' : 'flex-start',
              backgroundColor: id == item.id ? '#3399cc' : '#333',
            }]}>
              <Text style={styles.txtItem}>{item?.content}</Text>
            </View>
          )
        }}
      />
      <View style={styles.bottom}>
        <TextInput
          placeholder="Typing"
          onChangeText={setMessage}
          value={message}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={styles.btnSend}>
          <Text style={styles.txtSend}>{'Send'}</Text>
        </TouchableOpacity>
      </View>
    </>

  );
}
const styles = StyleSheet.create({
  bottom: {
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10
  },
  btnSend: {
    height: 45,
    justifyContent: 'center',
    paddingRight: 10
  },
  txtSend: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue'
  },
  containerList: {
    marginTop: 50,
    paddingHorizontal: 20
  },
  item: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    maxWidth: '70%',
    marginBottom: 10,
  },
  txtItem: {
    color: 'white'
  }
})
export default App;
