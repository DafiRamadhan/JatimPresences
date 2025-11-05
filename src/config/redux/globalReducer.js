const globalState = {
  nip: '20123074',
  userLogin: 'Anas Enggar S',
  namaCabang: 'Cabang Utama',
  namaWilayah: 'Cabang Utama',
  kdBiroSdm: '',
  kdCabSdm: '',
  kdCabCore: '',
  divisi: '',
  levelDesc: 'Analis Kredit',
  kdCab: '001',
  kdWil: '01',
  skim: 'ALL',
  lvlUser: '1', // 1. STAFF, 2.PENYELIA, 3.PIMCAPEM, 4.PINCAB
  lvlGrp: '2', //1, ANALIS, 2. ADMIN KRD, 3.PPK, 4.MIKRO
  userCode: 'STMKR',
  kodeshift: '',
  mapList: [],
  dataAgunan: [],
  totNilaiMarket: 0,
  totPersenAgunan: 0,
  fotoUser: '',
  idOneSignal: '',
  latKantor: 0,
  longKantor: 0,
  modalQuestion: false,
  modalAbsen: false,
  ilang: false,
  nip_otor: '',
  badgeOtorPerjadin: 0,
  appVersion: '3.01',
};

const rootReducer = (state = globalState, action) => {
  if (action.type === 'SETLGN') {
    return {
      ...state,
      nip: action.nip,
      userLogin: action.userLogin,
      namaCabang: action.namaCabang,
      namaWilayah: action.namaWilayah,
      divisi: action.divisi,
      kodeshift: action.kodeshift,
      levelDesc: action.levelDesc,
      kdCab: action.kdCab,
      kdWil: action.kdWil,
      userCode: action.userCode,
      lvlUser: action.lvlUser,
      fotoUser: action.fotoUser,
      lvlGrp: action.lvlGrp,
      latKantor: action.latKantor,
      longKantor: action.longKantor,
      kdBiroSdm: action.kdBiroSdm,
      kdCabSdm: action.kdCabSdm,
      kdCabCore: action.kdCabCore,
      nip_otor: action.nip_otor,
    };
  }
  if (action.type === 'SETSKIM') {
    return {
      ...state,
      skim: action.skim,
    };
  }
  if (action.type === 'SETMAPPING') {
    return {
      ...state,
      mapList: action.mapList,
    };
  }
  if (action.type === 'SETDATAAGUNAN') {
    return {
      ...state,
      dataAgunan: action.dataAgunan,
      totNilaiMarket: action.dataAgunan.reduce(
        (a, {NILAI_MARKET}) => a + Number(NILAI_MARKET),
        0,
      ),
    };
  }
  if (action.type === 'SETTING') {
    return {
      ...state,
      idOneSignal: action.idOneSignal,
    };
  }
  if (action.type === 'SETMDLQSTN') {
    return {
      ...state,
      modalQuestion: action.modalQuestion,
    };
  }
  if (action.type === 'SETMDLABSEN') {
    return {
      ...state,
      modalAbsen: action.modalAbsen,
    };
  }
  if (action.type === 'SETILANG') {
    return {
      ...state,
      ilang: action.ilang,
    };
  }
  if (action.type === 'SETBADGE') {
    return {
      ...state,
      badgeOtorPerjadin: action.badgeOtorPerjadin,
    };
  }
  return state;
};

export default rootReducer;
