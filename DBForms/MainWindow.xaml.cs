using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Collections;
using DBManager;
using System.Timers;
using DBManager.Models;

namespace DbForms
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    /// 

    public class UserText
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Organization { get; set; }
        public string Jobs { get; set; } 
    }

    //public class UserCustom
    //{
    //    public long ID { get; set; }
    //    public string Name { get; set; }
    //    public string Surname { get; set; }
    //    public long OrganisationID { get; set; } 
    //}

    //public class OrganisationCustom
    //{
    //    public long ID { get; set; }
    //    public string Name { get; set; }
    //}

    //public class JobCustom
    //{
    //    public long ID { get; set; }
    //    public string Name { get; set; }
    //}

    //public class UserJobCustom
    //{
    //    public long ID { get; set; }
    //    public long UserID { get; set; }
    //    public long JobID { get; set; }
    //}

    public partial class MainWindow : Window
    {
        private Dictionary<string, TextBox> TextBoxes = new Dictionary<string, TextBox>();
        private ComboBox SelectMode = new ComboBox();
        private StackPanel Panel = new StackPanel();
        private StackPanel JobPanel = new StackPanel();
        private Button NewJobButton = new Button();
        private DataGrid DG = new DataGrid();

        private TextBox MakeTextBox(string text)
        {
            var textBox = new TextBox();
            textBox.Text = text;
            textBox.Width = 120;
            textBox.Height = 23;
            TextBoxes[text] = textBox;
            textBox.GotFocus += ToggleFocus;
            textBox.LostFocus += ToggleFocus;
            return textBox;
        }

        public MainWindow()
        {
            InitializeComponent();

            string[] stringItems = { "SELECT MODE", "Insert user", "Delete user", "Add job to a user", "Remove job from a user", "Show all users" };
            foreach (var i in stringItems) SelectMode.Items.Add(i);
            SelectMode.GotMouseCapture += SelectMode_GotMouseCapture;
            SelectMode.SelectedIndex = 0;
            SelectMode.Width = 120;
            SelectMode.Height = 25;
            SelectMode.SelectionChanged += SelectMode_SelectionChanged;
            Panel.Children.Add(SelectMode);

            DG.Width = 400;
            DG.Height = 400;
            DG.Visibility = Visibility.Collapsed;
            Panel.Children.Add(DG);
            
            string[] placeholders = { "user's name", "user's surname", "organization" };
            foreach (var p in placeholders)
            {
                var textBox = MakeTextBox(p);
                textBox.Visibility = Visibility.Collapsed;
                Panel.Children.Add(textBox);
            }

            NewJobButton.Content = "new job row";
            NewJobButton.Click += (s, e) => JobPanel.Children.Add(MakeTextBox("job " + JobPanel.Children.Count));
            JobPanel.Visibility = Visibility.Collapsed;
            Panel.Children.Add(JobPanel);

            Panel.HorizontalAlignment = HorizontalAlignment.Left;
            someGrid.Children.Add(Panel);
            someGrid.Margin = new Thickness(0, 0, 0, 0);

            this.KeyDown += MainWindow_KeyDown;
        }

        private void ToggleFocus(object sender, RoutedEventArgs e)
        {
            var textBox = sender as TextBox;
            var placeholder = TextBoxes.Single(x => x.Value == textBox).Key;
            
            if (textBox.Text == "") textBox.Text = placeholder;
            else if (textBox.Text == placeholder) textBox.Text = "";
        }

        void SelectMode_GotMouseCapture(object sender, MouseEventArgs e)
        {
            if (SelectMode.Items[0] as string == "SELECT MODE") SelectMode.Items.RemoveAt(0);
            SelectMode.GotMouseCapture -= SelectMode_GotMouseCapture;
        }

        private async void SelectMode_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

            foreach (var tb in TextBoxes) tb.Value.Visibility = Visibility.Collapsed;
            JobPanel.Visibility = Visibility.Collapsed;
            JobPanel.Children.Clear();
            DG.Visibility = Visibility.Collapsed;
            var selected = SelectMode.SelectedItem as string;
            switch (selected)
            {
                case "Insert user":
                    foreach (var tb in TextBoxes)
                    {
                        tb.Value.Visibility = Visibility.Visible;
                    }
                    JobPanel.Children.Add(NewJobButton);
                    JobPanel.Visibility = Visibility.Visible;
                    break;
                case "Delete user":
                    TextBoxes["user's name"].Visibility = Visibility.Visible;
                    TextBoxes["user's surname"].Visibility = Visibility.Visible;
                    break;
                case "Add job to a user":
                case "Remove job from a user":
                    TextBoxes["user's name"].Visibility = Visibility.Visible;
                    TextBoxes["user's surname"].Visibility = Visibility.Visible;
                    JobPanel.Children.Add(MakeTextBox("job"));
                    JobPanel.Visibility = Visibility.Visible;
                    break;
                case "Show all users":
                    var task = DBInteraction.GetAllUsersTextAsync();
                    StatusText.Text = "fetching users";
                    List<UserText> users = null;
                    var timer = new Timer(500);
                    timer.Elapsed += (s, ev) => this.Dispatcher.Invoke((Action)(() => StatusText.Text = StatusText.Text + "."));
                    timer.Start();
                    users = await task;
                    timer.Stop();
                    StatusText.Text = "users found: " + users.Count;
                    var list = new List<UserText>();
                    foreach (var u in users)
                    {
                        list.Add(u);
                    }
                    DG.ItemsSource = list;
                    DG.Visibility = Visibility.Visible;
                    DG.Height = 200;
                    break;
                default:
                    break;
            }
        }

        private void MainWindow_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                var userName = TextBoxes["user's name"].Text;
                var userSurname = TextBoxes["user's surname"].Text;
                var org = TextBoxes["organization"].Text;
                var selected = SelectMode.SelectedItem as string;
                switch (selected)
                {
                    case "Insert user":
                        var jobs = new List<string>();
                        for (var i = 1; i < JobPanel.Children.Count; ++i)
                        {
                            var jobText = (JobPanel.Children[i] as TextBox).Text;
                            if (jobText != "" && !jobText.StartsWith("job "))
                            {
                                jobs.Add(jobText);
                            }                
                        }
                        DBInteraction.InsertUser(userName, userSurname, org, jobs.ToArray());
                        StatusText.Text = "user inserted successfully";
                        break;
                    case "Delete user":
                        DBInteraction.RemoveUser(userName, userSurname);
                        StatusText.Text = "user removed successfully";
                        break;
                    case "Add job to a user":
                        DBInteraction.AddJobToUser(userName, userSurname, (JobPanel.Children[0] as TextBox).Text);
                        StatusText.Text = "job added successfully";
                        break;
                    case "Remove job from a user":
                        DBInteraction.RemoveJobFromUser(userName, userSurname, (JobPanel.Children[0] as TextBox).Text);
                        StatusText.Text = "job removed successfully";
                        break;
                    default:
                        break;
                }
                    
            }
        }



    }
}
