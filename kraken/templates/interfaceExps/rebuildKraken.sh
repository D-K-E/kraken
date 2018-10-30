# rebuild kraken for interface experiments
echo "removing kraken"
pip uninstall kraken
currentDir=$(echo $PWD)
echo "Starting rebuild"
mainDir="$currentDir/../../../"
echo $currentDir
cd $mainDir
python setup.py build
echo "Build Done"
python setup.py install
echo "install done"
cd $currentDir
ketos transcribe image1nice.jpg image2hard.jpg viet1.jpg testimage.tif
echo "transcription interface is ready for reuse"
echo "all done"
