
const meta = {
    DATE_KEY : 'Date (MM/DD/YYYY)',
    STATION_NUMBER_KEY: 'station_number',
    ETR_KEY : 'ETR (W/m^2)',
    ETRN_KEY : 'ETRN (W/m^2)',
    GHI_KEY : 'GHI (W/m^2)',
    GHI_SOURCE_KEY : 'GHI source',
    GHI_UNCERT_KEY : 'GHI uncert (%)',
    DNI_KEY : 'DNI (W/m^2)',
    DNI_SOURCE_KEY : 'DNI source',
    DNI_UNCERT_KEY : 'DNI uncert (%)',
    DHI_KEY : 'DHI (W/m^2)',
    DHI_SOURCE_KEY : 'DHI source',
    DHI_UNCERT_KEY : 'DHI uncert (%)',
    GH_ILLUM_KEY : 'GH illum (lx)',
    GH_ILLUM_SOURCE_KEY : 'GH illum source',
    PRESSURE_KEY : 'Pressure (mbar)',
    PRESSURE_SOURCE_KEY : 'Pressure source',
    PRESSURE_UNCERT_KEY : 'Pressure uncert (code)',
    WDIR_KEY : 'Wdir (degrees)',
    WDIR_SOURCE : 'Wdir source',
    WDIR_UNCERT_KEY : 'Wdir uncert (code)',
    WSPD_KEY : 'Wspd (m/s)',
    WSPD_SOURCE_KEY : 'Wspd source',
    CEILHGT_KEY : 'CeilHgt (m)',
    AOD_KEY : 'AOD (unitless)',
    ALB_KEY : 'Alb (unitless)',
    TOTCLD_KEY : 'TotCld (tenths)',
}

const NUMERIC_COLUMNS = [
    meta.ETR_KEY,
    meta.ETRN_KEY,
    meta.GHI_KEY,
    meta.GHI_UNCERT_KEY,
    meta.DNI_KEY,
    meta.DNI_UNCERT_KEY,
    meta.DHI_KEY,
    meta.DHI_UNCERT_KEY,
    meta.GH_ILLUM_KEY,
    meta.PRESSURE_KEY,
    meta.PRESSURE_UNCERT_KEY,
    meta.WDIR_KEY,
    meta.WDIR_UNCERT_KEY,
    meta.WSPD_KEY,
    meta.CEILHGT_KEY,
    meta.AOD_KEY,
    meta.ALB_KEY,
    meta.TOTCLD_KEY
];

module.exports = {
    meta,
    NUMERIC_COLUMNS
}