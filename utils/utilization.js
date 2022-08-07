 function fortmatCurrency(value) {
  return 'Rp' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}



module.exports = {
  fortmatCurrency: fortmatCurrency,
}