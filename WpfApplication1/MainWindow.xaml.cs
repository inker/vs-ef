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
using DBInt;

namespace DbForms
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    /// 


    public partial class MainWindow : Window
    {

        private class DataObject
        {
            public string Name { get; set; }
            public string Surname { get; set; }
            public string Organization { get; set; }
            public string Jobs { get; set; } 

        }

        //private Dictionary<TextBox, string> placeholders;
        private Dictionary<string, TextBox> textBoxes;

        private TextBox MakeTextBox(string text)
        {
            var textBox = new TextBox();
            textBox.Text = text;
            textBox.Width = 120;
            textBox.Height = 23;
            textBoxes[text] = textBox;
            textBox.GotFocus += ToggleFocus;
            textBox.LostFocus += ToggleFocus;
            return textBox;
        }

        public MainWindow()
        {
            InitializeComponent();

            var panel = new StackPanel();
            someGrid.Children.Add(panel);
            var selectMode = new ComboBox();
            panel.Children.Add(selectMode);
            
            string[] stringItems = { "Insert user", "Delete user", "Add job to a user", "Remove job from a user", "Show all users" };
            foreach (var i in stringItems)
            {
                selectMode.Items.Add(i);
            }
            selectMode.Width = 120;
            selectMode.Height = 25;
            var newJobPanel = new StackPanel();
            newJobPanel.Visibility = Visibility.Collapsed;
            
            var newJobButton = new Button();
            newJobButton.Click += (sender, e) =>
            {
                var textbox = MakeTextBox("job " + newJobPanel.Children.Count);
                newJobPanel.Children.Add(textbox);
            };

            var dg = new DataGrid();
            dg.Width = 400;
            dg.Height = 400;
            dg.Visibility = Visibility.Collapsed;

            panel.Children.Add(dg);
            //newJobButton.Visibility = Visibility.Collapsed;
            selectMode.SelectionChanged += (sender, e) =>
            {
                foreach (var tb in textBoxes) tb.Value.Visibility = Visibility.Collapsed;
                newJobPanel.Visibility = Visibility.Collapsed;
                newJobPanel.Children.Clear();
                dg.Visibility = Visibility.Collapsed;
                var selected = (sender as ComboBox).SelectedItem as string;
                switch (selected)
                {
                    case "Insert user":
                        foreach (var tb in textBoxes)
                        {
                            tb.Value.Visibility = Visibility.Visible;
                        }
                        newJobPanel.Children.Add(newJobButton);
                        newJobButton.Content = "new job row";
                        newJobPanel.Visibility = Visibility.Visible;
                        break;
                    case "Delete user":
                        textBoxes["user's surname"].Visibility = Visibility.Visible;
                        break;
                    case "Add job to a user":
                        textBoxes["user's surname"].Visibility = Visibility.Visible;
                        newJobPanel.Children.Add(MakeTextBox("job"));
                        break;
                    case "Remove job from a user":
                        textBoxes["user's surname"].Visibility = Visibility.Visible;
                        newJobPanel.Children.Add(MakeTextBox("job"));
                        break;
                    case "Show all users":
                        var users = DBInteraction.getAllUsers();
                        // finding the maximal number of jobs the user can have
                        // so to know the number of columns
                        var maxJobNum = users.Max(el => el.Value.Count);
                        foreach (var u in users)
                        {
                            
                        }
                        
                        var nameCol = new DataGridTextColumn();
                        nameCol.MinWidth = 50;
                        nameCol.Binding = new Binding("name");
                        var surnameCol = new DataGridTextColumn();
                        surnameCol.MinWidth = 50;
                        surnameCol.Binding = new Binding("surname");
                        var orgCol = new DataGridTextColumn();
                        orgCol.MinWidth = 50;
                        orgCol.Binding = new Binding("organization");
                        var jobsCol = new DataGridTextColumn();
                        jobsCol.MinWidth = 50;
                        jobsCol.Binding = new Binding("jobs");
                        dg.Columns.Add(nameCol);
                        dg.Columns.Add(surnameCol);
                        dg.Columns.Add(orgCol);
                        dg.Columns.Add(jobsCol);
                        var list = new List<DataObject>();
                        foreach (var u in users) list.Add(new DataObject
                        {
                            Name = u.Key.Name,
                            Surname = u.Key.Surname,
                            Organization = u.Key.Organisation.Name,
                            Jobs = string.Join(",", u.Value)
                        });
                        dg.ItemsSource = list;
                        dg.Visibility = Visibility.Visible;
                        break;
                    default:
                        break;
                }
            };
            string[] placeholders = { "user's name", "user's surname", "organization" };
            textBoxes = new Dictionary<string, TextBox>();
            
            
            foreach (var p in placeholders)
            {
                var textBox = MakeTextBox(p);
                //Grid.SetRow(textBox, i);
                //textBox.Margin = new Thickness(0, 50 + 50 * i, 0, 0);
                //textBoxes.Add(p, textBox);
                panel.Children.Add(textBox);
                //someGrid.Children.Add(textBox);
            }
            panel.Children.Add(newJobPanel);
            
            someGrid.Margin = new Thickness(0, 0, 0, 0);
            this.KeyDown += (sender, e) =>
            {
                if (e.Key == Key.Enter)
                {
                    var userName = textBoxes["user's name"].Text;
                    var userSurname = textBoxes["user's surname"].Text;
                    var org = textBoxes["user's organization"].Text;
                    var selected = selectMode.SelectedItem as string;
                    switch (selected)
                    {
                        case "Insert user":
                            var jobs = new List<string>();
                            for (var i = 1; i < newJobPanel.Children.Count; ++i)
                            {
                                jobs.Add((newJobPanel.Children[i] as TextBox).Text);
                            }
                            DBInteraction.InsertUser(userName, userSurname, org, jobs.ToArray());
                            break;
                        case "Delete user":
                            DBInteraction.RemoveUser(userSurname);
                            break;
                        case "Add job to a user":
                            DBInteraction.AddJobToUser(userSurname, (newJobPanel.Children[0] as TextBox).Text);
                            break;
                        case "Remove job from a user":
                            DBInteraction.RemoveJobFromUser(userSurname, (newJobPanel.Children[0] as TextBox).Text);
                            break;
                        default:
                            break;
                    }
                    
                }
            };

        }

        private void ToggleFocus(object sender, RoutedEventArgs e)
        {

            var textBox = sender as TextBox;
            var placeholder = textBoxes.Single(x => x.Value == textBox).Key;
            if (textBox.Text == "")
            {
                textBox.Text = placeholder;
            }
            else if (textBox.Text == placeholder)
            {
                textBox.Text = "";
            }
        }

    }
}
