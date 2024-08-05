"use client"
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import styles from './page.module.css';

const AddItemForm = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        const q = query(collection(firestore, 'pantryItems'), where('name', '==', name));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          await addDoc(collection(firestore, 'pantryItems'), { name, count: 1 });
        } else {
          querySnapshot.forEach(async (item) => {
            const itemDoc = doc(firestore, 'pantryItems', item.id);
            await updateDoc(itemDoc, { count: item.data().count + 1 });
          });
        }
        setName('');
        onAdd();
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add Item"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Add Item</button>
    </form>
  );
};

const Item = ({ item, onUpdate, onDelete }) => {
  const handleIncrement = async () => {
    try {
      const itemDoc = doc(firestore, 'pantryItems', item.id);
      await updateDoc(itemDoc, { count: item.count + 1 });
      onUpdate();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDecrement = async () => {
    try {
      if (item.count > 1) {
        const itemDoc = doc(firestore, 'pantryItems', item.id);
        await updateDoc(itemDoc, { count: item.count - 1 });
        onUpdate();
      } else {
        await deleteDoc(doc(firestore, 'pantryItems', item.id));
        onDelete();
      }
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <div className={styles.item}>
      <span>{item.name} ({item.count})</span>
      <div>
        <button onClick={handleIncrement} className={styles.counterButton}>+</button>
        <button onClick={handleDecrement} className={styles.counterButton}>-</button>
      </div>
    </div>
  );
};

const PantryPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'pantryItems'), (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
    });

    return () => unsubscribe();
  }, []);

  const refreshItems = () => {
    // This function can be used to refresh items if needed
  };

  return (
    <div className={styles.container}>
      <h1>Items</h1>
      <AddItemForm onAdd={refreshItems} />
      <div className={styles.itemsContainer}>
        {items.map((item) => (
          <Item key={item.id} item={item} onUpdate={refreshItems} onDelete={refreshItems} />
        ))}
      </div>
    </div>
  );
};

export default PantryPage;
