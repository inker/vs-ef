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

namespace WpfApplication1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    /// 


    public partial class MainWindow : Window
    {

        //private Dictionary<TextBox, string> placeholders;
        private Dictionary<string, TextBox> textBoxes;

        private TextBox MakeTextBox(string text)
        {
            var textBox = new TextBox();
            textBox.Text = text;
            textBox.Width = 120;
            textBox.Height = 23;
            textBoxes.Add(text, textBox);
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
            
            string[] stringItems = { "Insert user", "Delete user", "Add job to a user", "Remove job from a user" };
            foreach (var i in stringItems)
            {
                selectMode.Items.Add(i);
            }
            selectMode.Width = 120;
            selectMode.Height = 25;
            var jobN = 0;
            selectMode.SelectionChanged += (sender, e) =>
            {
                var selected = (sender as ComboBox).SelectedItem as string;
                switch (selected)
                {
                    case "Insert user":
                        var newJobButton = new Button();
                        newJobButton.Content = "new job row";
                        var newJobPanel = new StackPanel();
                        panel.Children.Add(newJobButton);
                        panel.Children.Add(newJobPanel);
                        newJobButton.Click += (sender1, e1) =>
                        {
                            var textbox = MakeTextBox("job " + (++jobN).ToString());
                            newJobPanel.Children.Add(textbox);
                        };

                        

                        break;
                    case "Delete user":
                        break;
                    case "Add job to a user":
                        break;
                    case "Remove job from a user":
                        break;
                    default:
                        break;
                }
            };
            string[] placeholders = { "user's name", "user's surname", "organization" };
            textBoxes = new Dictionary<string, TextBox>();
            
            
            for (var i = 0; i < placeholders.Length; ++i)
            {
                var p = placeholders[i];
                var textBox = MakeTextBox(p);
                //Grid.SetRow(textBox, i);
                //textBox.Margin = new Thickness(0, 50 + 50 * i, 0, 0);
                //textBoxes.Add(p, textBox);
                panel.Children.Add(textBox);
                //someGrid.Children.Add(textBox);
            }

            
            someGrid.Margin = new Thickness(0, 0, 0, 0);
            

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
