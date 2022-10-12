import {bucket} from './firebase';
import {uploadBytes, ref, getDownloadURL, deleteObject} from 'firebase/storage';

export const uploadImage = async (image: File, folder: string) => {
	try {
		let filename = `${folder}/${new Date().getTime()}.${image.type.split('/')[1]}`;
		let imageRef = ref(bucket, filename);
    console.log(filename)
		await uploadBytes(imageRef, await image.arrayBuffer());
    return {url: await getDownloadURL(imageRef)};
	} catch (err) {
    return {error: (err as Error).message};
  }
};

export const unUploadImage = async (url: string) => {
  try {
    let imageRef = ref(bucket, url);
    await deleteObject(imageRef);
  } catch (err) {
    return {error: (err as Error).message};
  }
}
