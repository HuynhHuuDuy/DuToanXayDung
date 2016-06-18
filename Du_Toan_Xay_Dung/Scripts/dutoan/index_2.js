"use strict"

$(document).ready(function () {
    $('#cmbtencv').selectpicker({
        size: 10,
        liveSearch: true,
        width: "500px"
    });

    $('#cbb_haophis').selectpicker({
        liveSearch: true,
        width: "538px"
    });
    $(document).on('click', '#myDropdown .dropdown-menu', function (e) {
        e.stopPropagation();
    });
    var listNew = getcbbhaophis().map(function (item) {
        item.TenUnicode = remove_unicode(item.Ten);
        return item;
    });
    var ulShow = $('#cbb-haophis_show');
    for (var i = 0; i < 100; i++) {
        var li = $('<li class="col-lg-12"></li>');
        li.attr('data-value', listNew[i].MaVL_NC_MTC);
        li.attr('data-donvi', listNew[i].DonVi);
        li.attr('data-gia', listNew[i].Gia);
        li.text(listNew[i].Ten);
        ulShow.append(li);
    }

    $('#search-cbb-haophis').on('input', function (e) {
        var search = $(this).val();
        var resultSearch = SearchText(listNew, 'TenUnicode', search);

        var ulShowS = $('#cbb-haophis_show');
        ulShowS.html('');
        for (var j = 0; j < resultSearch.length; j++) {
            var liS = $('<li class="col-lg-12"></li>');
            liS.attr('data-value', resultSearch[j].MaVL_NC_MTC);
            liS.attr('data-donvi', resultSearch[j].DonVi);
            liS.attr('data-gia', resultSearch[j].Gia);
            liS.text(resultSearch[j].Ten);
            ulShowS.append(liS);
            liS.bind("click");
        }
    });



    $('#div_primary').on('click', '.btn_xoa_cv', function () {
        var con_cv = confirm("Bạn có thật sự muốn xóa công việc này...!!!");
        if (con_cv == true) {
            var sum_thanhtien_cv = $(this).parent().parent().find("input[name='txtthanhtien[]']").val();
            var old_price = $('#container').find('#txt_tongtien').val();
            var new_price = parseFloat(old_price) - parseFloat(sum_thanhtien_cv);
            new_price = new_price.toFixed(3);
            $('#txt_tongtien').val(new_price);
            $('#span_tongtien').html(new_price);
            $(this).closest('tr').remove();
        }
    });
    $("#btn_edit_ten_hangmuc").click(function () {
        var s = prompt("Nhập tên Hạng Mục mới", "");
        $('#txt_ten_hangmuc').val(s);
        $('#h3_hangmuc').text(s);

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


            setTimeout(function () {
                var _trNew = '<tr class="tr_primary">' +
        '<td></td>' +
        '<td class="td_tencv">' + _tencv +
        '<input type="hidden" value="' + _idDinhMuc + '" name="txtmahieucv_dm[]" />' +
        '<input type="hidden" value="' + _tencv + '" name="txttencv[]" />' +
        '</td>' +
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
                Total();
            }, 500);

        },
        error: function (err) {
            console.log(err.status + " - " + err.statusText);
        }
    });
});


$('#div_primary').on('change', "input[name='txtkhoiluong[]']", function () {
    var giavl = $(this).parent().parent().find("input[name='txtgiavl[]']").val();
    var gianc = $(this).parent().parent().find("input[name='txtgianc[]']").val();
    var giamtc = $(this).parent().parent().find("input[name='txtgiamtc[]']").val();


    var tong = parseFloat(giavl) + parseFloat(gianc) + parseFloat(giamtc);
    var price = $(this).val() * tong;

    price = price.toFixed(3);

    $(this).parent().parent().find('.sum_thanhtien').html(price);
    $(this).parent().parent().find("input[name='txtthanhtien[]']").val(price);
    Total();
});


$('#div_primary').on('change', "input[name='txtgiavl[]']", function () {


    var giavl_new = $(this).parent().parent().find("input[name='txtgiavl[]']").val();
    var gianc = $(this).parent().parent().find("input[name='txtgianc[]']").val();
    var giamtc = $(this).parent().parent().find("input[name='txtgiamtc[]']").val();

    var khoiluong = $(this).parent().parent().find("input[name='txtkhoiluong[]']").val();

    var tong = parseFloat(giavl_new) + parseFloat(gianc) + parseFloat(giamtc);
    var price = tong * khoiluong;

    price = price.toFixed(3);

    $(this).parent().parent().find('.sum_thanhtien').html(price);
    $(this).parent().parent().find("input[name='txtthanhtien[]']").val(price);
    Total();
});

$('#div_primary').on('change', "input[name='txtgianc[]']", function () {


    var giavl = $(this).parent().parent().find("input[name='txtgiavl[]']").val();
    var gianc_new = $(this).parent().parent().find("input[name='txtgianc[]']").val();
    var giamtc = $(this).parent().parent().find("input[name='txtgiamtc[]']").val();

    var khoiluong = $(this).parent().parent().find("input[name='txtkhoiluong[]']").val();

    var tong = parseFloat(giavl) + parseFloat(gianc_new) + parseFloat(giamtc);
    var price = tong * khoiluong;

    price = price.toFixed(3);

    $(this).parent().parent().find('.sum_thanhtien').html(price);
    $(this).parent().parent().find("input[name='txtthanhtien[]']").val(price);
    Total();
});

$('#div_primary').on('change', "input[name='txtgiamtc[]']", function () {

    var giavl = $(this).parent().parent().find("input[name='txtgiavl[]']").val();
    var gianc = $(this).parent().parent().find("input[name='txtgianc[]']").val();
    var giamtc_new = $(this).parent().parent().find("input[name='txtgiamtc[]']").val();

    var khoiluong = $(this).parent().parent().find("input[name='txtkhoiluong[]']").val();

    var tong = parseFloat(giavl) + parseFloat(gianc) + parseFloat(giamtc_new);
    var price = tong * khoiluong;

    price = price.toFixed(3);

    $(this).parent().parent().find('.sum_thanhtien').html(price);
    $(this).parent().parent().find("input[name='txtthanhtien[]']").val(price);
    Total();
});

function Total() {
    var total = 0;
    $('#div_primary .sum_thanhtien').each(function () {
        total += parseFloat($(this).html());
    });
    total = total.toFixed(3);
    $('#txt_tongtien').val(total);
    $('#span_tongtien').html(total);
}

$('#btnSubmit').click(function () {
    $('#formAdd').submit();
});

function getcbbhaophis() {
    var data;
    $.ajax({
        type: "POST",
        url: '/HangMuc/GetDSDonGia',
        data: {},
        cache: false,
        dataType: "json",
        async: false,
        success: function (result) {
            data = result;
        }
    });
    return data;
}

function remove_unicode(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
}

function SearchText(list, field, keyword) {
    var result = [];
    for (var s = 0; s < list.length; s++) {
        if (list[s][field].toLowerCase().indexOf(keyword) != -1) {
            result.push(list[s]);
        }
    }
    return result;
}

function SelectValue(input) {
    var ten = $(input).attr('data-ten');
    var donvi = $(input).attr('data-donvi');
    var gia = $(input).attr('data-gia');
    var mahp_tamtinh = $(input).val();

    /*
    if (mahp_tamtinh.substring(0, 1) == "V")
        giavl = parseFloat(giavl) + parseFloat(gia);
    if (mahp_tamtinh.substring(0, 1) == "N")
        gianc = parseFloat(gianc) + parseFloat(gia);
    if (mahp_tamtinh.substring(0, 1) == "M")
        giamtc = parseFloat(giamtc) + parseFloat(gia);
    */
    var _trnew_tamtinh = '<tr class="HaoPhi_TamTinh">' +
        '<td>' + mahp_tamtinh + '</td>' +
        '<td>' + ten + '</td>' +
        '<td>' + donvi + '</td>' +
        '<td>' + gia + '</td>' +
        '<td><span class="btn btn-danger btn-flat btn-xs btnxoa_haophitt"><i class="fa fa-edit"></i>Xóa</span></td>' +
        '</tr>';
    $('#table_tamtinh').find('tbody').append(_trnew_tamtinh);
}

$('body').on('click', '#cbb-haophis_show li', function () {
    var liSelect = $(this);
    $('#cbb_haophis_1').html('<span class="pull-left">-- ' + liSelect.html() + '</span><span class="caret pull-right"></span>');
    var inputHidden = $('#select-cbb-haophis');
    inputHidden.val(liSelect.attr('data-value'));
    inputHidden.attr('data-donvi', liSelect.attr('data-donvi'));
    inputHidden.attr('data-gia', liSelect.attr('data-gia'));
    inputHidden.attr('data-ten', liSelect.html());
    $('#myDropdown').removeClass('open');
    SelectValue(inputHidden);
});