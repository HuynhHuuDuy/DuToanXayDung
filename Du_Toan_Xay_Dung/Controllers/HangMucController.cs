using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Du_Toan_Xay_Dung.Models;
using Du_Toan_Xay_Dung.Handlers;

namespace Du_Toan_Xay_Dung.Controllers
{
    public class HangMucController : Controller
    {

        public DataDTXDDataContext _db = new DataDTXDDataContext();
        //
        // GET: /TT_D_KLCongViec/
        
        public ActionResult Index(string ID)
        {

            if (ID != null)
            {
                int d = ID.IndexOf(',');
                if (d == -1)
                {
                    ViewData["CongTrinh"] = _db.CongTrinhs.Where(i => i.MaCT.Equals(ID)).Select(i => new CongTrinhViewModel(i)).FirstOrDefault();
                }
                else
                {
                    var Arr_ID = ID.Split(',');
                    ViewData["CongTrinh"] = _db.CongTrinhs.Where(i => i.MaCT.Equals(Arr_ID[0])).Select(i => new CongTrinhViewModel(i)).FirstOrDefault();
                    ViewData["HangMuc_ChiTiet"] = _db.CongViecs.Where(i => i.MaHM.Equals(Arr_ID[1])).Select(i => new CongViec_User_ViewModel(i)).ToList();
                    ViewData["HangMuc"] = _db.HangMucs.Where(i => i.MaHM.Equals(Arr_ID[1])).Select(i => new HangMucViewModel(i)).FirstOrDefault();
                }
            }

            if (SessionHandler.User != null)
            {
                ViewData["DSCongTrinh"] = _db.CongTrinhs.Where(i => i.Email.Equals(SessionHandler.User.Email)).Select(i => new CongTrinhViewModel(i)).ToList();
            }


            ViewData["DSDinhMuc"] = _db.DinhMucs.Select(i => new DinhMucViewModel(i)).ToList();

            return View();
        }

        public ActionResult Index_2(string ID)
        {
            if (ID != null)
            {
                int d = ID.IndexOf(',');
                if (d == -1)
                {
                    ViewData["CongTrinh"] = _db.CongTrinhs.Where(i => i.MaCT.Equals(ID)).Select(i => new CongTrinhViewModel(i)).FirstOrDefault();
                }
                else
                {
                    var Arr_ID = ID.Split(',');
                    ViewData["CongTrinh"] = _db.CongTrinhs.Where(i => i.MaCT.Equals(Arr_ID[0])).Select(i => new CongTrinhViewModel(i)).FirstOrDefault();
                    ViewData["HangMuc_ChiTiet"] = _db.CongViecs.Where(i => i.MaHM.Equals(Arr_ID[1])).Select(i => new CongViec_User_ViewModel(i)).ToList();
                    ViewData["HangMuc"] = _db.HangMucs.Where(i => i.MaHM.Equals(Arr_ID[1])).Select(i => new HangMucViewModel(i)).FirstOrDefault();
                }
            }

            if (SessionHandler.User != null)
            {
                ViewData["DSCongTrinh"] = _db.CongTrinhs.Where(i => i.Email.Equals(SessionHandler.User.Email)).Select(i => new CongTrinhViewModel(i)).ToList();
            }


            ViewData["DSDinhMuc"] = _db.DinhMucs.Select(i => new DinhMucViewModel(i)).ToList();

            return View();
        }


        [HttpPost]
        public JsonResult getAllPrice(string idDinhMuc)
        {
            decimal totalGiaVL = 0;
            decimal totalGiaNC = 0;
            decimal totalGiaMay = 0;

            var giaVL = _db.ChiTiet_DinhMucs
                .Where(i => i.MaHieuCV_DM.Equals(idDinhMuc) && i.MaVL_NC_MTC.Contains("V")).ToList();
            foreach (var item in giaVL)
            {
                var _temGia = _db.DonGias.Where(i => i.MaVL_NC_MTC.Equals(item.MaVL_NC_MTC)).FirstOrDefault();
                totalGiaVL += _temGia.Gia * item.SoLuong;
            }
            var giaNC = _db.ChiTiet_DinhMucs.Where(i => i.MaHieuCV_DM.Equals(idDinhMuc) && i.MaVL_NC_MTC.Contains("N")).ToList();
            foreach (var item in giaNC)
            {
                var _temGia = _db.DonGias.Where(i => i.MaVL_NC_MTC.Equals(item.MaVL_NC_MTC)).FirstOrDefault();
                totalGiaNC += _temGia.Gia * item.SoLuong;
            }

            var giaMay = _db.ChiTiet_DinhMucs.Where(i => i.MaHieuCV_DM.Equals(idDinhMuc) && i.MaVL_NC_MTC.Contains("M")).ToList();
            foreach (var item in giaMay)
            {
                var _temGia = _db.DonGias.Where(i => i.MaVL_NC_MTC.Equals(item.MaVL_NC_MTC)).FirstOrDefault();
                totalGiaMay += _temGia.Gia * item.SoLuong;
            }
            return Json(new { totalGiaVL = totalGiaVL, totalGiaNC = totalGiaNC, totalGiaMay = totalGiaMay, idDinhMuc });
        }

        
    }
}
