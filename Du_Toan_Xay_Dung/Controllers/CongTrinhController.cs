﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Du_Toan_Xay_Dung.Models;
using Du_Toan_Xay_Dung.Handlers;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;

namespace Du_Toan_Xay_Dung.Controllers
{
    public class CongTrinhController : Controller
    {
        DataDTXDDataContext _db = new DataDTXDDataContext();
        //
        // GET: /CongTrinh/

        public ActionResult Index()
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;

                var list_mact = _db.CongTrinhs.Where(i => i.Email.Equals(user.Email)).Select(i => i.MaCT).ToList();

                ViewData["List_CongTrinh"] = (from ct in _db.CongTrinhs
                                              where ct.Email.Equals(user.Email)
                                              select new CongTrinhViewModel()
                                              {
                                                  MaCT = ct.MaCT,
                                                  TenCT = ct.TenCT,
                                                  MoTa = ct.MoTa,
                                                  Gia = ct.Gia
                                              }).ToList();

                ViewData["List_HangMuc"] = (from hm in _db.HangMucs
                                            where list_mact.Contains(hm.MaCT)
                                            select new HangMucViewModel()
                                            {
                                                MaCT = hm.MaCT,
                                                MaHM = hm.MaHM,
                                                TenHM = hm.TenHM,
                                                MoTa = hm.MoTa,
                                                Gia = hm.Gia
                                            }).ToList();

            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            return View();
        }


        public ActionResult ChiTiet_CongTrinh(string id)
        {

            ViewData["CongTrinh"] = _db.CongTrinhs.Where(i => i.MaCT.Equals(id)).Select(i => new CongTrinhViewModel(i)).FirstOrDefault();

            ViewData["ChiTiet_CongTrinh"] = (from hm in _db.HangMucs
                                    where hm.MaCT.Equals(id)
                                    select new HangMucViewModel()
                                    {
                                        MaHM = hm.MaHM,
                                        TenHM = hm.TenHM,
                                        MoTa = hm.MoTa,
                                        Gia = hm.Gia
                                    }).ToList();

            return View();
        }

        public ActionResult UpdateCongTrinh(string ID)
        {
            if (SessionHandler.User == null)
            {
                return RedirectToAction("Login", "Account");
            }
            else
            {
                if (ID != null)
                {
                    ViewData["CongTrinh_Update"] = _db.CongTrinhs.Where(i => i.MaCT.Equals(ID)).Select(i => new CongTrinhViewModel(i)).FirstOrDefault();
                }
            }
            return View();
        }

        [HttpPost]
        public ActionResult UpdateCongTrinh(FormCollection form)
        {
            if (SessionHandler.User == null)
            {
                return RedirectToAction("Login", "Account");
            }
            else
            {
                string ID = form["Ma"];
                if (ID != null)
                {
                    var congtrinh = _db.CongTrinhs.Single(i => i.MaCT.Equals(ID));
                    if (congtrinh != null)
                    {
                        congtrinh.TenCT = form["TenCT"];
                        congtrinh.MoTa = form["MoTa"];
                        congtrinh.Gia = Convert.ToDecimal(form["Gia"]);
                        
                        //hinh anh

                        _db.SubmitChanges();
                        return RedirectToAction("Index", "CongTrinh");
                    }
                }
            }
            return View();
        }

        public ActionResult ThemCongTrinh()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ThemCongTrinh(CongTrinhViewModel obj)
        {
            if (SessionHandler.User == null)
            {
                return RedirectToAction("Login", "Account");
            }
            try
            {
                var index = _db.CongTrinhs.Count() + 1;         //Phai chinh sua
                var congtrinh = new CongTrinh();
                congtrinh.MaCT = "CT" + index;
                congtrinh.Email = SessionHandler.User.Email;
                congtrinh.TenCT = obj.TenCT;
                congtrinh.MoTa = obj.MoTa;
                congtrinh.Gia = 0;

                _db.CongTrinhs.InsertOnSubmit(congtrinh);
                _db.SubmitChanges();
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                return RedirectToAction("ThemCongTrinh");
            }
        }

    }
}