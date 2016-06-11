$(document).ready(function () {
    $('#div_primary').on('click', '.btn_xoa_cv', function () {
        var con_cv = confirm("Bạn có thật sự muốn xóa công việc này...!!!");
        if (con_cv == true) {
            $(this).closest('tr').remove();
            var sum_thanhtien_cv = $(this).parent().parent().find("input[name='txtthanhtien[]']").val();
            var price_old = $('#div_primary').find('#txt_tongtien').val();
            var price_new = parseFloat(price_old) - parseFloat(sum_thanhtien_cv);
            price_new = price_new.toFixed(3);
            $('#txt_tongtien').val(price_new);
            $('#tongtien').html(price_new);
        }
    });
});


$('#div_primary').on('change', 'select', function () {

    var _idDinhMuc = $(this).val();
    var _donvi = $(this).find('option:selected').attr('data-donvi');
    var _tencv = $(this).find(':selected').text()
    var _txtGiaVatLieu = 0;
    var _txtGiaNhanCong = 0;
    var _txtGiaMayThiCong = 0;
    var _taga = '';
    var _lblThanhTien = '0';
    var _txtThanhTien = 0;

    $.ajax({
        type: "POST",
        url: '/HangMuc/getAllPrice',
        data: { idDinhMuc: _idDinhMuc },
        cache: false,
        dataType: "json",
        success: function (result) {
            _txtGiaVatLieu = result.totalGiaVL;
            _txtGiaNhanCong = result.totalGiaNC;
            _txtGiaMayThiCong = result.totalGiaMay;
            _lblThanhTien = (parseFloat(result.totalGiaVL) + parseFloat(result.totalGiaNC) + parseFloat(result.totalGiaMay)).toFixed(3);
            _txtThanhTien = (parseFloat(result.totalGiaVL) + parseFloat(result.totalGiaNC) + parseFloat(result.totalGiaMay)).toFixed(3);
            //Total();

            setTimeout(function () {
                var _trNew = '<tr class="tr_primary">' +
        '<td>1</td>' +
        '<td class="td_tencv">' + _tencv + '</td>' +
        '<td>' +
        '<input style="width:50px" type="text" value="' + _donvi + '" name="txtdonvi[]" />' +
        '</td>' +
        '<td>' +
        '<input style="width:50px" type="text" value="1" class="txt_khoiluong" name="txtkhoiluong[]" />' +
        '</td>' +
        '<td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd">' +
        '<input style="width:80px" type="text" value="' + _txtGiaVatLieu + '" name="txtgiavl[]" />' +
        '</td>' +
        '<td style="border-right:1px solid #dddddd;">' +
        '<input style="width: 80px" type="text" value="' + _txtGiaNhanCong + '" name="txtgianc[]" />' +
        '</td>' +
        '<td style="border-right:1px solid #dddddd;">' +
        '<input style="width: 80px" type="text" value="' + _txtGiaMayThiCong + '" name="txtgiamtc[]" />' +
        '</td>' +
        '<td style="border-right:1px solid #dddddd;" class="tag_a">' +
        '<a class="btn btn-primary btn-flat btn-xs" href="/HangMuc/ChiTiet_VL_NC_MTC/?ID=' + _idDinhMuc + '" target="_blank">' +
        '<i class="fa fa-edit"></i> Detail' +
        '</a>' +
        '</td>' +
        '<td>' +
        '<span class="sum_thanhtien">' + _lblThanhTien + '</span>' +
        '<input type="hidden" value="' + _txtThanhTien + '" name="txtthanhtien[]" />' +
        '</td>' +
        '<td style="border-left:1px solid #dddddd;">' +
        '<span class="btn btn-danger btn-flat btn-xs btn_xoa_cv">' +
        '<i class="fa fa-edit"></i>Xóa' +
        '</span>' +
        '</td>' +
        '</tr>';
                $('#mytable').find('tbody').append(_trNew);
            }, 500);

        },
        error: function (err) {
            console.log(err.status + " - " + err.statusText);
        }
    });
});