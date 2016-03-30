(function () {

  angular
    .module('loc8rApp')
    .controller('appointmentDetailCtrl', appointmentDetailCtrl);

  appointmentDetailCtrl.$inject = ['$routeParams', '$location', 'loc8rData'];
  function appointmentDetailCtrl ($routeParams, $location, loc8rData) {
    var vm = this;
    vm.appointmentid = $routeParams.appointmentid;

    vm.currentPath = $location.path();

    loc8rData.appointmentById(vm.appointmentid)
      .success(function(data) {
        vm.data = { appointment: data };
        vm.pageHeader = {
          title: vm.data.appointment.reason
        };
      })
      .error(function (e) {
        console.log(e);
      });

  }

})();
