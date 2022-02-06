using System;
using System.Collections.Generic;
using Application.Profiles;

namespace Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { set; get; }
        public String Title { set; get; }
        public DateTime Date { set; get; }
        public String Description { set; get; }
        public String Category { set; get; }
        public String City { set; get; }
        public String Venue { set; get; }
        public string HostUsername { get; set; }
        public bool IsCancelled { get; set; }
        public ICollection<AttendeeDto> Attendees { get; set; }
    }
}