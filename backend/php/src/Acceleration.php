<?php

namespace Acceleration;

use Acceleration\Exceptions\BaseViewInvalid;
use Acceleration\Exceptions\BaseViewNotFound;
use Acceleration\Exceptions\BaseViewUrlNotSet;
use Acceleration\Exceptions\CouldNotSetBaseView;
use DOMDocument;

class Acceleration
{

    /**
     * This function accepts an link to the base html view (important: The base HTML view has to have a div with the id "main")
     * 
     * @param string $url
     * 
     * @throws BaseViewNotFound
     * @throws BaseViewInvalid
     * @throws CouldNotSetBaseView
     * 
     * @return void
     */
    public static function setBaseView(string $url): void
    {

        //try to load the html
        $html = file_get_contents($url);
        if ($html === false) throw new BaseViewNotFound($url);

        //check if the html contains a div with the "main" id
        $dom = new DOMDocument();
        $dom->loadHTML($html);

        $main = $dom->getElementById("main");
        if (is_null($main) || $main->tagName !== "div") throw new BaseViewInvalid();

        $ret = putenv("ACCELERATION_BASE_VIEW=$url");
        if ($ret === false) throw new CouldNotSetBaseView();
    }

    /**
     * This function either returns a simple page object as array or a full html page as string
     * 
     * @param string $page_name
     * @param array<string,mixed> $props
     * 
     * @throws BaseViewUrlNotSet
     * @throws BaseViewNotFound
     * @throws BaseViewInvalid
     * 
     * @return string|array<string,mixed>
     */
    public static function get(string $page_name, array $props): string|array
    {

        $page_object = [
            "component" => $page_name,
            "props" => $props,
            "url" => $_SERVER['REQUEST_URI']
        ];


        //if acceleration is initialised simply return a page JSON ojbect
        if (isset($_SERVER['HTTP_X_ACCELERATION']) and $_SERVER['HTTP_X_ACCELERATION']) {
            return $page_object;
        }

        //otherwhise get the baseview
        $baseview_url = getenv("ACCELERATION_BASE_VIEW");
        if ($baseview_url === false) throw new BaseViewUrlNotSet();

        $html = file_get_contents($baseview_url);
        if ($html === false) throw new BaseViewNotFound($baseview_url);

        //check if the html contains a div with the "main" id
        $dom = new DOMDocument();
        $dom->loadHTML($html);

        $main = $dom->getElementById("main");
        if (is_null($main) || $main->tagName !== "div") throw new BaseViewInvalid();

        $main->setAttribute("x-page",json_encode($page_object));

        return $dom->saveHTML();
    }

    /**
     * This function calls the get function, but it sets the content-type to either json or html
     * and simply returns a string
     * 
     * @param string $page_name
     * @param array<string,mixed> $props
     * 
     * @throws BaseViewUrlNotSet
     * @throws BaseViewNotFound
     * @throws BaseViewInvalid
     * 
     * @return string
     */
    public static function render(string $page_name, array $props): string
    {
        $ret = Acceleration::get($page_name,$props);
        if(is_array($ret)){
            header('Content-Type: application/json; charset=utf-8');
            return json_encode($ret);
        }

        header('Content-Type: text/html; charset=utf-8');
        return $ret;
        
    }
}
