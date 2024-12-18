import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWallet, updateWallet } from '../store/walletSlice';
import { logout } from '../store/authSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();

  const { balance, transactions, w_id , err} = useSelector((state) => state.wallet);

  const [amount, setAmount] = useState(''); // State for amount input
  const [category, setCategory] = useState(''); // State for category input
  const [category1, setCategory1] = useState(''); // State for category input
  const [filteredTransactions, setFilteredTransactions] = useState(transactions); // Filtered transactions

  // Fetch wallet on initial render
  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  // Handle adding/subtracting balance with category
  const handleUpdateBalance = (type) => {
    const numericAmount = parseFloat(amount);
    try{
    if (!isNaN(numericAmount) && numericAmount > 0) {
      dispatch(updateWallet({ amount: numericAmount, type, category1, w_id })).then(() => {
        dispatch(fetchWallet()); 
        setAmount('');
        setCategory('');
      });
    } else {
      alert('Please enter a valid amount greater than 0');
    }
    if(err){
      alert("Account Freezez")
    }
    
  }
    catch (e) {
      alert("Accout Freeze")
    }
  };

  // Handle category filtering
  const handleCategoryFilter = (text) => {
    setCategory(text);
    const filtered = transactions.filter((transaction) => 
      transaction.category?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  // Sort transactions by createdAt (latest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <View style={styles.container}>
      

      <Text style={styles.balanceText}>Current Balance: ₹{balance}</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter category (optional)"
          value={category1}
          onChangeText={(text) => setCategory1(text)}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Add Amount" onPress={() => handleUpdateBalance('add')} color="#28a745" />
        <Button title="Subtract Amount" onPress={() => { if(balance<amount){
          return Alert.alert("Insufficient funds")
        }

           handleUpdateBalance('subtract')}} color="#dc3545" />
      </View>

      {/* Logout Button */}
      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={() => dispatch(logout())} color="#6c757d" />
      </View>

      {/* Transactions List */}
      <Text style={styles.transactionsTitle}>Transactions:</Text>

      {/* Filter Input */}
      <TextInput
        style={styles.input}
        placeholder="Filter by Category"
        value={category}
        onChangeText={handleCategoryFilter}
      /> 
      <FlatList
        data={sortedTransactions}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>
              {item.type.toUpperCase()} ₹{item.amount}
            </Text>
            {item.category && <Text style={styles.categoryText}>Category: {item.category}</Text>}
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()} // Ensure unique keys
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  balanceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  logoutButton: {
    marginVertical: 10,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#495057',
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    backgroundColor: '#ffffff',
    marginVertical: 2,
    borderRadius: 5,
  },
  transactionText: {
    fontSize: 16,
    color: '#212529',
  },
  categoryText: {
    fontSize: 14,
    color: '#6c757d',
  },
  dateText: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 3,
  },
});
