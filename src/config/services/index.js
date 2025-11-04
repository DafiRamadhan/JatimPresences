import Get from './Get';
import Post from './Post';

const Login = data => Post('Login', data);
const GetJarak = data => Post('GetJarak', data);
const GetQuestion = data => Post('GetQuestion', data);
const GetGoogleLocation = path => Get(1, path);
const InsertDeviceInfo = data => Post('SaveDeviceInfo', data);
const InqQuestion = data => Post('InqQuestion', data);
const RekapAbsensi = data => Post('RekapAbsensi', data);
const InsertQuestion = data => Post('SimpanQuestioner', data);
const InsertAbsensi = data => Post('InsertAbsensi', data);
const ListHistAbsensi = data => Post('ListHistAbsensi', data);
const InqKetAbsen = data => Post('InqKetAbsen', data);
const InquiryAbsen = data => Post('InquiryAbsensi', data);
const Ilang = data => Post('Ilang', data);
const InqShift = data => Post('InqShift', data);
const ListKantor = data => Post('ListKantor', data);
const FaceRecognition = data => Post('FaceRecognition', data);
const SimpleFaceRecognition = data => Post('SimpleFaceRecognition', data);
const ListOtorPerjadin = data => Post('ListOtorPerjadin', data);
const SaveOtorPerjadin = data => Post('SaveOtorPerjadin', data);
const SaveNIPAtasan = data => Post('SaveNipAtasan', data);
const GetBadge = data => Post('GetBadgeOtorPerjadin', data);
const AbsensiEvent = data => Post('AbsensiEvent', data);
const ListHistAbsensiEvent = data => Post('ListHistAbsensiEvent', data);

const API = {
  Login,
  GetJarak,
  GetGoogleLocation,
  InqQuestion,
  InsertQuestion,
  InsertAbsensi,
  ListHistAbsensi,
  InqKetAbsen,
  InquiryAbsen,
  GetQuestion,
  RekapAbsensi,
  InsertDeviceInfo,
  Ilang,
  InqShift,
  ListKantor,
  FaceRecognition,
  SimpleFaceRecognition,
  ListOtorPerjadin,
  SaveOtorPerjadin,
  SaveNIPAtasan,
  GetBadge,
  AbsensiEvent,
  ListHistAbsensiEvent,
};

export default API;
