'use server';

import { db } from '@/lib/firebase';
import { UserProfile, SavedLook, WardrobeItem } from '@/lib/types';
import { collection, doc, getDoc, setDoc, getDocs, addDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const LOOKS_COLLECTION = 'looks';
const WARDROBE_COLLECTION = 'wardrobe';

// For now, we'll use a hardcoded user ID. In a real app, this would come from an auth system.
const MOCK_USER_ID = 'mock-user-123';

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const userDocRef = doc(db, USERS_COLLECTION, MOCK_USER_ID);
  await setDoc(userDocRef, profile, { merge: true });
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const userDocRef = doc(db, USERS_COLLECTION, MOCK_USER_ID);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export async function saveLook(look: Omit<SavedLook, 'id'>): Promise<string> {
    const looksCollectionRef = collection(db, USERS_COLLECTION, MOCK_USER_ID, LOOKS_COLLECTION);
    const docRef = await addDoc(looksCollectionRef, look);
    return docRef.id;
}

export async function getSavedLooks(): Promise<SavedLook[]> {
    const looksCollectionRef = collection(db, USERS_COLLECTION, MOCK_USER_ID, LOOKS_COLLECTION);
    const querySnapshot = await getDocs(looksCollectionRef);
    const looks: SavedLook[] = [];
    querySnapshot.forEach((doc) => {
        looks.push({ id: doc.id, ...doc.data() } as SavedLook);
    });
    return looks;
}

export async function saveWardrobeItem(item: Omit<WardrobeItem, 'id'>): Promise<string> {
    const wardrobeCollectionRef = collection(db, USERS_COLLECTION, MOCK_USER_ID, WARDROBE_COLLECTION);
    const docRef = await addDoc(wardrobeCollectionRef, item);
    return docRef.id;
}

export async function getWardrobeItems(): Promise<WardrobeItem[]> {
    const wardrobeCollectionRef = collection(db, USERS_COLLECTION, MOCK_USER_ID, WARDROBE_COLLECTION);
    const querySnapshot = await getDocs(wardrobeCollectionRef);
    const items: WardrobeItem[] = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as WardrobeItem);
    });
    return items;
}
