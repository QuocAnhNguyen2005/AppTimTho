import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for demonstration
// const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key');

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Chào anh, tôi có thể qua kiểm tra tủ lạnh ngay bây giờ không?', sender: 'worker', time: '14:30' },
    { id: '2', text: 'Dạ được anh qua đi ạ, địa chỉ là 123 Nguyễn Văn Linh', sender: 'customer', time: '14:32' },
  ]);
  const [inputText, setInputText] = useState('');

  // Example Supabase Realtime subscription mock
  useEffect(() => {
    /*
    const channel = supabase.channel('chat_room_1')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
    */
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    const newMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'customer', // Or worker based on auth context
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
    
    // Example push to Supabase
    // supabase.from('messages').insert([newMsg]);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMine = item.sender === 'customer'; // Assuming we are customer viewing this
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.theirMessageText]}>{item.text}</Text>
        <Text style={[styles.messageTime, isMine ? styles.myMessageTime : styles.theirMessageTime]}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhắn tin với Thợ</Text>
        <TouchableOpacity>
          <Ionicons name="call" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add-circle" size={28} color="#999" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={24} color={inputText.trim() ? '#0066CC' : '#999'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  chatContainer: { flex: 1 },
  messageList: { padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#0066CC', borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#E8E9EB', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  myMessageText: { color: '#fff' },
  theirMessageText: { color: '#333' },
  messageTime: { fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  myMessageTime: { color: 'rgba(255,255,255,0.7)' },
  theirMessageTime: { color: '#999' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#EEE' },
  attachBtn: { marginRight: 12 },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15 },
  sendBtn: { marginLeft: 12 }
});
