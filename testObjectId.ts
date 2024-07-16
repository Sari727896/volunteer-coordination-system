import { ObjectId } from 'mongodb';

// Test ObjectId
const testId = '6672e3d10a596519749d78ee';

if (ObjectId.isValid(testId)) {
    console.log('Valid ID format');
} else {
    console.log('Invalid ID format');
}
