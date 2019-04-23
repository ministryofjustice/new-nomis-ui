package model

import static model.CaseloadType.*

enum Caseload {
    CADM_I('CADM_I', 'Central Administration Caseload for HMPS', INST, []),
    HBI('HBI', 'HOLLESLEY BAY (HMP)', INST, []),
    HHI('HHI', 'HOLME HOUSE (HMP)', INST, []),
    HCI('HCI', 'HUNTERCOMBE (HMPYOI)', INST, []),
    KMI('KMI', 'KIRKHAM (HMP)', INST, []),
    LAI('LAI', 'LANCASTER CASTLE (HMP)', INST, []),
    LFI('LFI', 'LANCASTER FARMS (HMPYOI)', INST, []),
    LEI('LEI', 'LEEDS (HMP)', INST, [AgencyLocation.LEI]),
    LWI('LWI', 'LEWES (HMP)', INST, []),
    LII('LII', 'LINCOLN (HMP)', INST, []),
    LHI('LHI', 'LINDHOLME (HMP)', INST, []),
    LPI('LPI', 'LIVERPOOL (HMP)', INST, []),
    LNI('LNI', 'LOW NEWTON (HMP)', INST, []),
    MSI('MSI', 'MAIDSTONE (HMP)', INST, []),
    MDI('MDI', 'MOORLAND CLOSED (HMP & YOI)', INST, [AgencyLocation.MDI]),
    HDI('HDI', 'HATFIELD (HMP & YOI)', INST, []),
    MHI('MHI', 'MORTON HALL IMMIGRATION REMOVAL CENTRE', INST, []),
    NSI('NSI', 'NORTH SEA CAMP (HMP)', INST, []),
    NNI('NNI', 'NORTHALLERTON (HMP)', INST, []),
    NWI('NWI', 'NORWICH (HMP & YOI)', INST, []),
    NMI('NMI', 'NOTTINGHAM (HMP)', INST, []),
    PRI('PRI', 'PARC (HMP)', INST, []),
    PVI('PVI', 'PENTONVILLE (HMP)', INST, []),
    UPI('UPI', 'PRESCOED (HMP & YOI)', INST, []),
    RNI('RNI', 'RANBY (HMP)', INST, []),
    RSI('RSI', 'RISLEY (HMP)', INST, []),
    RCI('RCI', 'ROCHESTER (HMP & YOI)', INST, []),
    SDI('SDI', 'SEND (HMP)', INST, []),
    SYI('SYI', 'SHREWSBURY (HMP)', INST, [SYI]),
    EHI('EHI', 'STANDFORD HILL (HMP)', INST, []),
    SHI('SHI', 'STOKE HEATH (HMPYOI)', INST, []),
    SUI('SUI', 'SUDBURY (HMP)', INST, []),
    SLI('SLI', 'SWALESIDE (HMP)', INST, []),
    SNI('SNI', 'SWINFEN HALL (HMP)', INST, []),
    VEI('VEI', 'THE VERNE (HMP)', INST, []),
    TCI('TCI', 'THORN CROSS (HMPYOI)', INST, []),
    WII('WII', 'WARREN HILL (HMP & YOI)', INST, []),
    WEI('WEI', 'WEALSTUN (HMP)', INST, []),
    WNI('WNI', 'WERRINGTON (HMPYOI)', INST, []),
    WYI('WYI', 'WETHERBY (HMPYOI)', INST, []),
    WRI('WRI', 'WHITEMOOR (HMP)', INST, []),
    WOI('WOI', 'WOLDS (HMP)', INST, []),
    WSI('WSI', 'WORMWOOD SCRUBS (HMP)', INST, []),
    TRN('TRN', 'TRANSFER', INST, []),
    BHI('BHI', 'BLANTYRE HOUSE (HMP)', INST, []),
    BSI('BSI', 'BRINSFORD (HMP)', INST, []),
    BXI('BXI', 'BRIXTON (HMP)', INST, [BXI]),
    BZI('BZI', 'BRONZEFIELD (HMP)', INST, []),
    BNI('BNI', 'BULLINGDON (HMP)', INST, []),
    CHI('CHI', 'CAMP HILL (HMP)', INST, []),
    CSI('CSI', 'CASTINGTON (HMP & YOI)', INST, []),
    CDI('CDI', 'CHELMSFORD (HMP)', INST, []),
    CKI('CKI', 'COOKHAM WOOD (HMP)', INST, []),
    DRI('DRI', 'DORCHESTER (HMP)', INST, []),
    DVI('DVI', 'Dover Immigration Removal Centre', INST, []),
    EYI('EYI', 'ELMLEY (HMP)', INST, []),
    EVI('EVI', 'EVERTHORPE (HMP)', INST, []),
    FSI('FSI', 'FEATHERSTONE (HMP)', INST, []),
    FDI('FDI', 'FORD (HMP)', INST, []),
    FHI('FHI', 'FOSTON HALL (HMP)', INST, []),
    FNI('FNI', 'FULL SUTTON (HMP)', INST, []),
    GPI('GPI', 'GLEN PARVA (HMPYOI & RC)', INST, []),
    GNI('GNI', 'GRENDON/SPRING HILL (HMP)', INST, []),
    HRI('HRI', 'Haslar Immigration Removal Centre', INST, []),
    HOI('HOI', 'HIGH DOWN (HMP)', INST, []),
    HII('HII', 'HINDLEY (HMP & YOI)', INST, []),
    HYI('HYI', 'HOLLOWAY (HMP)', INST, []),
    HLI('HLI', 'HULL (HMP)', INST, []),
    PTI('PTI', 'KINGSTON (HMP)', INST, []),
    KVI('KVI', 'KIRKLEVINGTON GRANGE (HMP)', INST, []),
    LMI('LMI', 'LATCHMERE HOUSE (HMP)', INST, []),
    LCI('LCI', 'LEICESTER (HMP)', INST, []),
    LYI('LYI', 'LEYHILL (HMP)', INST, []),
    LTI('LTI', 'LITTLEHEY (HMP)', INST, []),
    LLI('LLI', 'LONG LARTIN (HMP)', INST, []),
    LGI('LGI', 'LOWDHAM GRANGE (HMP)', INST, []),
    MRI('MRI', 'MANCHESTER (HMP)', INST, []),
    ONI('ONI', 'ONLEY (HMP & YOI)', INST, []),
    PDI('PDI', 'PORTLAND (HMPYOI)', INST, []),
    PNI('PNI', 'PRESTON (HMP)', INST, []),
    RDI('RDI', 'READING (HMP & YOI)', INST, []),
    RHI('RHI', 'RYE HILL (HMP)', INST, []),
    SMI('SMI', 'SHEPTON MALLET (HMP)', INST, []),
    SFI('SFI', 'STAFFORD (HMP)', INST, []),
    SKI('SKI', 'STOCKEN (HMP)', INST, []),
    STI('STI', 'STYAL (HMP & YOI)', INST, []),
    SWI('SWI', 'SWANSEA (HMP)', INST, []),
    MTI('MTI', 'THE MOUNT (HMP)', INST, []),
    WAI('WAI', 'THE WEARE (HMP)', INST, [WAI]),
    UKI('UKI', 'USK (HMP)', INST, []),
    WWI('WWI', 'WANDSWORTH (HMP)', INST, []),
    WLI('WLI', 'WAYLAND (HMP)', INST, []),
    WBI('WBI', 'WELLINGBOROUGH (HMP)', INST, []),
    WTI('WTI', 'WHATTON (HMP)', INST, []),
    WCI('WCI', 'WINCHESTER (HMP)', INST, []),
    WHI('WHI', 'WOODHILL (HMP)', INST, []),
    WMI('WMI', 'WYMOTT (HMP)', INST, []),
    ZZGHI('ZZGHI', 'GHOST HOLDING ESTABLISHMENT', INST, [AgencyLocation.WAI]),
    SPI('SPI', 'SPRING HILL (HMP)', INST, []),
    PBI('PBI', 'PETERBOROUGH (HMP)', INST, []),
    KTI('KTI', 'KENNET (HMP)', INST, []),
    LIC('LIC', 'LICENCE CHANGES FOR INACTIVE OFFENDERS', INST, []),
    HEI('HEI', 'HEWELL (HMP)', INST, []),
    HQGRP('HQGRP', 'DO NOT USE', INST, []),
    ISI('ISI', 'ISIS HMP/YOI', INST, []),
    PFI('PFI', 'PETERBOROUGH FEMALE HMP', INST, []),
    GTI('GTI', 'GARTREE (HMP)', INST, []),
    WDI('WDI', 'WAKEFIELD (HMP)', INST, []),
    PKI('PKI', 'PARKHURST (HMP)', INST, []),
    NHI('NHI', 'NEW HALL (HMP)', INST, []),
    DTI('DTI', 'DEERBOLT (HMPYOI)', INST, []),
    BRI('BRI', 'BURE (HMP)', INST, []),
    ADMINC('ADMINC', 'REF- COMMUNITY ADMIN CASELOAD', COMM, []),
    ADMINI('ADMINI', 'REF- INSTITUTIONAL ADMIN CASELOAD', INST, []),
    ALI('ALI', 'ALBANY (HMP)', INST, []),
    AKI('AKI', 'ACKLINGTON (HMP)', INST, []),
    ACI('ACI', 'ALTCOURSE (HMP)', INST, []),
    ASI('ASI', 'ASHFIELD (HMP)', INST, []),
    AWI('AWI', 'ASHWELL (HMP)', INST, []),
    AGI('AGI', 'ASKHAM GRANGE (HMP & YOI)', INST, []),
    AYI('AYI', 'AYLESBURY (HMP)', INST, []),
    BFI('BFI', 'BEDFORD (HMP)', INST, []),
    BAI('BAI', 'BELMARSH (HMP)', INST, []),
    BMI('BMI', 'BIRMINGHAM (HMP)', INST, []),
    BTI('BTI', 'BLAKENHURST (HMP)', INST, []),
    BDI('BDI', 'BLUNDESTON (HMP)', INST, []),
    BLI('BLI', 'BRISTOL (HMP)', INST, []),
    BKI('BKI', 'BROCKHILL (HMP & YOI)', INST, []),
    BCI('BCI', 'BUCKLEY HALL (HMP)', INST, []),
    BUI('BUI', 'BULLWOOD HALL (HMP & YOI)', INST, []),
    CYI('CYI', 'CANTERBURY (HMP)', INST, []),
    CFI('CFI', 'CARDIFF (HMP)', INST, []),
    CWI('CWI', 'CHANNINGS WOOD (HMP)', INST, []),
    CLI('CLI', 'COLDINGLEY (HMP)', INST, []),
    DAI('DAI', 'DARTMOOR (HMP)', INST, []),
    DNI('DNI', 'DONCASTER (HMP)', INST, []),
    DGI('DGI', 'DOVEGATE (HMP)', INST, []),
    DWI('DWI', 'DOWNVIEW (HMP)', INST, []),
    DHI('DHI', 'DRAKE HALL (HMP & YOI)', INST, []),
    DMI('DMI', 'DURHAM (HMP)', INST, []),
    ESI('ESI', 'EAST SUTTON PARK (HMP & YOI)', INST, []),
    EWI('EWI', 'EASTWOOD PARK (HMP)', INST, []),
    NEI('NEI', 'EDMUNDS HILL (HMP)', INST, []),
    EEI('EEI', 'ERLESTOKE (HMP)', INST, []),
    EXI('EXI', 'EXETER (HMP)', INST, []),
    FMI('FMI', 'FELTHAM (HMP & YOI)', INST, []),
    FBI('FBI', 'FOREST BANK (HMP & YOI)', INST, []),
    FKI('FKI', 'FRANKLAND (HMP)', INST, []),
    GHI('GHI', 'GARTH (HMP)', INST, []),
    GLI('GLI', 'GLOUCESTER (HMP)', INST, []),
    GMI('GMI', 'GUYS MARSH (HMP)', INST, []),
    HVI('HVI', 'HAVERIGG (HMP)', INST, []),
    HGI('HGI', 'HEWELL GRANGE (HMP)', INST, []),
    HPI('HPI', 'HIGHPOINT (HMP)', INST, []),
    HMI('HMI', 'HUMBER (HMP)', INST, []),
    NLI('NLI', 'NORTHUMBERLAND (HMP)', INST, []),
    OWI('OWI', 'OAKWOOD (HMP)', INST, []),
    TSI('TSI', 'THAMESIDE (HMP)', INST, []),
    MUL('MUL', 'MUL Prison', INST, [AgencyLocation.BXI, AgencyLocation.LEI]),
    NWEB('NWEB', 'Nomis-Web Application', APP, [])

    String id
    String description
    CaseloadType type
    List<AgencyLocation> locations

    Caseload(String id, String description, CaseloadType type, List<AgencyLocation> locations) {
        this.id = id
        this.description = description
        this.type = type
        this.locations = locations.asImmutable()
    }
}