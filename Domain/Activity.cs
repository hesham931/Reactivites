using System;
namespace Domain
{
    public class Activity
    {
        //this class will contain our coulmns in the database(table = 'Activities')
        //Guid is a data type used for create the Id in the client side so that we have not to wait for the server to create the id
        //you can put attribute [Required] on any proparity to make it not null attribute
        public Guid Id { set; get; }
        public String Title { set; get; }
        public DateTime Date { set; get; }
        public String Description { set; get; }
        public String Category { set; get; }
        public String City { set; get; }
        public String Venue { set; get; }
    }
}