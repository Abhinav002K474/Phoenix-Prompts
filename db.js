// Firebase Firestore & Storage Abstraction Layer
const DB_PROMPTS_COLLECTION = "prompts";

// Get all prompts from Firestore
async function getAllPrompts() {
  if (!window.db) {
    console.error("Firestore database is not initialized.");
    return [];
  }
  try {
    const snapshot = await window.db.collection(DB_PROMPTS_COLLECTION).get();
    const list = [];
    snapshot.forEach(doc => {
      list.push(doc.data());
    });
    return list;
  } catch (error) {
    console.error("Error getting prompts from Firestore: ", error);
    return [];
  }
}

// Create or Update a prompt in Firestore
async function upsertPrompt(promptObj) {
  if (!window.db) {
    console.error("Firestore database is not initialized.");
    return;
  }
  try {
    await window.db.collection(DB_PROMPTS_COLLECTION).doc(promptObj.id).set(promptObj);
    console.log("Prompt upserted successfully:", promptObj.id);
  } catch (error) {
    console.error("Error upserting prompt to Firestore:", error);
    throw error;
  }
}

// Delete a prompt from Firestore
async function deletePromptFromDB(id) {
  if (!window.db) {
    console.error("Firestore database is not initialized.");
    return;
  }
  try {
    await window.db.collection(DB_PROMPTS_COLLECTION).doc(id).delete();
    console.log("Prompt deleted successfully from Firestore:", id);
  } catch (error) {
    console.error("Error deleting prompt from Firestore:", error);
    throw error;
  }
}

// Upload image to Firebase Storage
async function uploadImageToStorage(fileOrBase64, promptId) {
  if (!window.storage) {
    console.error("Firebase Storage is not initialized.");
    return "";
  }
  try {
    const storageRef = window.storage.ref().child(`prompts/${promptId}`);
    let snapshot;
    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      // Upload Base64 Data URL
      snapshot = await storageRef.putString(fileOrBase64, 'data_url');
    } else {
      // Upload standard File object
      snapshot = await storageRef.put(fileOrBase64);
    }
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    throw error;
  }
}

// Seed default prompts if database is empty
async function seedDefaultPrompts(defaultList) {
  if (!window.db) return;
  try {
    const snapshot = await window.db.collection(DB_PROMPTS_COLLECTION).limit(1).get();
    if (snapshot.empty) {
      console.log("Firestore 'prompts' collection is empty. Seeding defaults...");
      for (const p of defaultList) {
        await window.db.collection(DB_PROMPTS_COLLECTION).doc(p.id).set(p);
      }
      console.log("Firestore seeding completed.");
    }
  } catch (error) {
    console.error("Error seeding default database:", error);
  }
}
